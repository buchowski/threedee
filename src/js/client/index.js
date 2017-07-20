import {
    unit, spaceUnit, lineageColor, deltas, lightDeltas, geometry,
    materialOne, materialTwo, hoverMaterial, lineMaterial, lineageLineMaterial
} from './constants'
import calcNewPosition from './positioning'

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

function attachEventHandlers(doc) {
    domEvents.addEventListener(doc.mesh, 'click', (e) => {
        darkenOldLineage(currentLineageIds)
        illuminateLineage(doc, 'both')
    })
}

function drawDat(doc, parentDoc) {
    let mesh = new THREE.Mesh(geometry, materialOne);

    if (parentDoc) {
        let { x, y, z } = parentDoc.mesh.position
        let numberChild = parentDoc.children.indexOf(doc.id)
        let { acceptedX, acceptedY, acceptedZ } = calcNewPosition(x, y - spaceUnit, z, numberChild,  parentDoc.children.length)
        let line

        doc.mesh = mesh
        scene.add(mesh);

        setObjPos(mesh, { x: acceptedX, y: acceptedY, z: acceptedZ })
        attachEventHandlers(doc)

        line = drawLine({ x, y, z }, mesh.position)
        registerLine(line, doc)
    } else {
        doc.mesh = mesh
        scene.add(mesh);
    }

    doc.children.forEach(childId => drawDat(docs[childId], doc))
}

function animate() {
    requestAnimationFrame(animate);

    Object.keys(docs).forEach((id) => {
        docs[id].mesh.rotation.y += Math.random() * 0.01;
    })

    saveCameraPos()
    renderer.render(scene, camera);
}

function getDummyData() {
    $.getJSON('/dummy-data')
        .then((resp) => {
            docs = resp
            genesisDoc = docs[Object.keys(docs).length]
            drawDat(genesisDoc)
        })
}

getDummyData()
setObjPos(camera, getCameraPos() || defaultCameraPositions)
controls = new OrbitControls(camera)
addLights()
animate();
