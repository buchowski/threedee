let OrbitControls = require('three-orbit-controls')(THREE)
let docs = require('./dummy-data.json')

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let controls = new OrbitControls(camera)
let renderer = new THREE.WebGLRenderer();
let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshLambertMaterial({ color: 0x2194ce, wireframe: false });
let docIds = Object.keys(docs)
let lights = [];

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
    let cube = new THREE.Mesh(geometry, material);

    docs[id].mesh = cube
    scene.add(cube);
    cube.position.z = -1.3 * index
    cube.position.x = 0.3 * index
    cube.position.y = 0.3 * index
})

function animate() {
    requestAnimationFrame(animate);

    docIds.forEach((id) => {
        docs[id].mesh.rotation.y += 0.01;
    })

    renderer.render(scene, camera);
}

animate();
