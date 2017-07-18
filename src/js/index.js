let OrbitControls = require('three-orbit-controls')(THREE)
let docs = require('./dummy-data.json')

const unit = 0.05
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let controls = new OrbitControls(camera)
let renderer = new THREE.WebGLRenderer();
let geometry = new THREE.OctahedronGeometry(unit)
let materialOne = new THREE.MeshLambertMaterial({ color: 0x2194ce, wireframe: false });
let materialTwo = new THREE.MeshLambertMaterial({ color: 0xf4416e, wireframe: false })
let lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
let genesisDoc = docs[Object.keys(docs).length]
let genesisMesh = new THREE.Mesh(geometry, materialTwo);
let docIds = Object.keys(docs)
let lights = [];
let takenPositions = []

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xefd1b5)
document.body.appendChild(renderer.domElement);
camera.position.z = 5;

lights[0] = new THREE.PointLight(0xffffff, 1, 0);
lights[1] = new THREE.PointLight(0xffffff, 1, 0);
lights[2] = new THREE.PointLight(0xffffff, 1, 0);

lights[0].position.set(0, 200, 0);
lights[1].position.set(100, 200, 100);
lights[2].position.set(-100, -200, -100);

scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

function isPositionTaken(x, y, z) {
    let positionString = [x, y, z].join(',')

    return takenPositions.indexOf(positionString) !== -1
}

function calcNewPosition(proposedX, proposedY, proposedZ) {
    let acceptedX = proposedX
    let acceptedY = proposedY
    let acceptedZ = proposedZ

    if (isPositionTaken(proposedX, proposedY, proposedZ)) {
        acceptedX *= -1
    }

    return { acceptedX, acceptedY, acceptedZ }
}

function drawDat(doc, parentDoc) {
    let spaceUnit = unit * 5

    if (parentDoc) {
        let { x, y, z } = parentDoc.mesh.position
        let mesh = new THREE.Mesh(geometry, materialOne);
        let numberChild = parentDoc.children.indexOf(doc.id)
        let lineGeometry = new THREE.Geometry();
        let proposedX = x + numberChild * spaceUnit
        let proposedY = y - spaceUnit
        let proposedZ = 0
        let line
        let { acceptedX, acceptedY, acceptedZ } = calcNewPosition(proposedX, proposedY, proposedZ)

        takenPositions.push([acceptedX, acceptedY, acceptedZ].join(','))
        doc.mesh = mesh
        scene.add(mesh);

        mesh.position.x = acceptedX
        mesh.position.y = acceptedY
        mesh.position.z = acceptedZ

        lineGeometry.vertices.push(new THREE.Vector3(x, y, z));
        lineGeometry.vertices.push(new THREE.Vector3(mesh.position.x, mesh.position.y, mesh.position.z))

        line = new THREE.Line(lineGeometry, lineMaterial)
        scene.add(line)
    } else {
        docs[genesisDoc.id].mesh = genesisMesh
        scene.add(genesisMesh);
    }

    doc.children.forEach(childId => drawDat(docs[childId], doc))
}

drawDat(genesisDoc)

function animate() {
    requestAnimationFrame(animate);

    Object.keys(docs).forEach((id) => {
        docs[id].mesh.rotation.y += Math.random() * 0.01;
    })

    renderer.render(scene, camera);
}

animate();
