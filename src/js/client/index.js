import {
    unit, spaceUnit, lineageColor, deltas, lightDeltas, geometry,
    materialOne, materialTwo, hoverMaterial, lineMaterial, lineageLineMaterial
} from './constants'
import { calcBlobPosition, calcBlobPositionCircle, resetTakenPositions } from './positioning'

let OrbitControls = require('three-orbit-controls')(THREE)

let docs = []
let genesisDoc
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
let domEvents = new THREEx.DomEvents(camera, renderer.domElement)
let defaultCameraPositions = { x: 0, y: 0, z: 5 }
let currentLineageIds = []
let controls
let newPositions = []

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xefd1b5)
document.body.appendChild(renderer.domElement);

function addLights() {
    [1, 2, 3].forEach((n, i) => {
        let light = new THREE.PointLight(0xffffff, 1, 0);
        let [x, y, z] = lightDeltas[i]

        light.position.set(x, y, z)
        scene.add(light);
    })
}

function saveCameraPos() {
    window.localStorage.setItem('camera-pos', JSON.stringify(camera.position))
}

function getCameraPos() {
    return JSON.parse(window.localStorage.getItem('camera-pos'))
}

function setObjPos(obj, { x, y, z }) {
    obj.position.x = x
    obj.position.y = y
    obj.position.z = z
}

function updateCoord(currentCoord, destinationCoord, step) {
    let newCoord

    if (currentCoord < destinationCoord) {
        newCoord = currentCoord + step

        return (newCoord > destinationCoord) ? destinationCoord : newCoord
    } else if (currentCoord > destinationCoord) {
        newCoord = currentCoord - step

        return (newCoord < destinationCoord) ? destinationCoord : newCoord
    }

    return currentCoord
}

function animatePosition(data) {
    let mesh = data.mesh
    let { x, y, z } = data.newPositions
    let step = 0.04
    let count = 100

    // while (x !== mesh.position.x || y !== mesh.position.y || z !== mesh.position.z) {
    while (count > 0) {
        x = updateCoord(mesh.position.x, x, step)
        y = updateCoord(mesh.position.y, y, step)
        z = updateCoord(mesh.position.z, z, step)

        setObjPos(mesh, { x, y, z })
        count--
    }
}

function drawLine(parentCoords, childCoords) {
    let lineGeometry = new THREE.Geometry();
    let halfUnit = unit / 2
    let [px, py, pz] = [parentCoords.x, parentCoords.y - unit, parentCoords.z]
    let [cx, cy, cz] = [childCoords.x, childCoords.y + unit, childCoords.z]

    lineGeometry.vertices.push(new THREE.Vector3(px, py, pz));
    lineGeometry.vertices.push(new THREE.Vector3(cx, cy, cz))

    let line = new THREE.Line(lineGeometry, lineMaterial)

    scene.add(line)

    return line
}

function registerLine(line, doc) {
    doc.lines = doc.lines || []
    doc.lines.push(line)
}

function darkenOldLineage(ids) {
    while (ids.length) {
        let id = ids.pop()
        let doc = docs[id]

        doc.mesh.material = materialOne
        if (doc.lines) {
            doc.lines.forEach((line) => { line.material = lineMaterial })
        }
    }
}

function illuminateLineage(doc, direction) {
    doc.mesh.material = hoverMaterial
    currentLineageIds.push(doc.id)

    if (doc.lines) {
        doc.lines.forEach((line) => { line.material = lineageLineMaterial })
    }

    if (direction === 'both' || direction === 'down') {
        doc.children.forEach(id => illuminateLineage(docs[id], 'down'))
    }

    if ((direction === 'both' || direction === 'up') && docs[doc.parentId]) {
        illuminateLineage(docs[doc.parentId], 'up')
    }
}

let panelTemplate = _.template(`
    <div class="glyphicon glyphicon-sunglasses"></div>
    <h1>plan_for_the_big_game.pdf</h1>
    <div>ID: <%= doc.id %></div>
    <div>Parent ID: <%= doc.parentId %></div>
    <div class="avatar <%= doc.avatarClass %>"></div>
    <div>Edited by <%= doc.author.name %></div>
    <div>Saved on <%= new Date(doc.timestamp).toString() %></div>
`)

function getAvatarClass(author) {
    if (/steve/i.test(author.name)) {
        return 'steve'
    } else if (/bob/i.test(author.name)) {
        return 'bobby'
    }

    return 'brian'
}

function updatePanel(doc) {
    let parentId = doc.parentId ? doc.parentId : 'N/A (genesis doc)'
    let avatarClass = getAvatarClass(doc.author)
    let updatedDoc = Object.assign(doc, { avatarClass, parentId })
    document.querySelector('#panel').innerHTML = panelTemplate({ doc: updatedDoc })
}

let $panel = $('#panel')
let $collapseIcon = $('.glyphicon-sunglasses')

function attachEventHandlers(doc) {
    domEvents.addEventListener(doc.mesh, 'click', (e) => {
        updatePanel(doc)
        // darkenOldLineage(currentLineageIds)
        // illuminateLineage(doc, 'both')
    })

    $collapseIcon.click((e) => {
        $panel.toggleClass('collapsed')
    })
}


function drawDat(doc, parentDoc) {
    let mesh = new THREE.Mesh(geometry, materialOne);

    if (parentDoc) {
        let { x, y, z } = parentDoc.mesh.position
        let numberChild = parentDoc.children.indexOf(doc.id)
        let { acceptedX, acceptedY, acceptedZ } = calcBlobPositionCircle(x, y - spaceUnit, z, numberChild, parentDoc.children.length)
        let line

        doc.mesh = mesh
        scene.add(mesh);

        setObjPos(mesh, { x: acceptedX, y: acceptedY, z: acceptedZ })
        attachEventHandlers(doc)

        line = drawLine({ x, y, z }, mesh.position)
        registerLine(line, doc)
    } else {
        doc.mesh = mesh
        mesh.material = hoverMaterial
        scene.add(mesh);
    }

    doc.children.forEach(childId => drawDat(docs[childId], doc))
}

function getNewPositions(doc, parentDoc) {
    let positions = []
    let acceptedPositions = { acceptedX: 0, acceptedY: 0, acceptedZ: 0 }
    let positionData

    if (parentDoc) {
        let { x, y, z } = parentDoc.mesh.position
        let numberChild = parentDoc.children.indexOf(doc.id)

        acceptedPositions = calcBlobPosition(x, y - spaceUnit, z, numberChild, parentDoc.children.length)
    }

    doc.children.forEach((childId) => {
        positions = positions.concat(getNewPositions(docs[childId], doc))
    })

    positionData = {
        mesh: doc.mesh,
        newPositions: {
            x: acceptedPositions.acceptedX,
            y: acceptedPositions.acceptedY,
            z: acceptedPositions.acceptedZ
        }
    }
    positions.push(positionData)

    return positions
}

// setTimeout(() => {
//     resetTakenPositions()
//     newPositions = getNewPositions(genesisDoc)
// }, 1000)

function animate() {
    requestAnimationFrame(animate);

    // while (newPositions.length) {
    //     animatePosition(newPositions.pop())
    // }

    Object.keys(docs).forEach((id) => { docs[id].mesh.rotation.y += Math.random() * 0.009 })

    saveCameraPos()
    renderer.render(scene, camera);
}

function getDummyData() {
    $.getJSON('/dummy-data')
        .then((resp) => {
            docs = resp
            genesisDoc = docs[Object.keys(docs).length]
            drawDat(genesisDoc)
            updatePanel(genesisDoc)
        })
}

getDummyData()
setObjPos(camera, getCameraPos() || defaultCameraPositions)
controls = new OrbitControls(camera)
addLights()
animate();

let input = document.querySelector('input')
function uploadHandler() {
    let file = this.files[0]
    let filenameSansPrefix = file.name.split('.')[0]

    docs[filenameSansPrefix].mesh.material = hoverMaterial
}

window.addEventListener('keypress', (e) => {
    if (e.key === 'u') {
        input.click()
    }
})

input.addEventListener('change', uploadHandler)

