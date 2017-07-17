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
let docIds = Object.keys(docs)
let lights = [];
let treeData = {}

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

docIds.forEach((id, index) => {
    let doubleUnit = unit * 2
    let doc = docs[id]
    let parentId = Number(doc.parentId)
    let material = materialOne
    let isGenesisDoc = !doc.parentId
    let mesh

    if (isGenesisDoc) {
        material = materialTwo
        parentId = docIds.length + 1
    }

    treeData[parentId] = treeData[parentId] ? ++treeData[parentId] : 1

    mesh = new THREE.Mesh(geometry, material);
    doc.mesh = mesh
    scene.add(mesh);
    mesh.position.x = (treeData[parentId] - 1) * doubleUnit
    mesh.position.y = (doubleUnit * parentId) - ((docIds.length * doubleUnit) / 2)
})

function animate() {
    requestAnimationFrame(animate);

    docIds.forEach((id) => {
        docs[id].mesh.rotation.y += 0.01;
    })

    renderer.render(scene, camera);
}

animate();
