let OrbitControls = require('three-orbit-controls')(THREE)

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let controls = new OrbitControls(camera)
let renderer = new THREE.WebGLRenderer();
let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshBasicMaterial({ color: 0x2194ce, wireframe: false });
let cubes = [];
let count = 0;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;

while (count < 20) {
    let cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    cube.position.z = -1.3 * count
    cube.position.x = 0.3 * count
    cube.position.y = 0.3 * count
    cubes.push(cube);
    count++;
}

function animate() {
    requestAnimationFrame(animate);

    cubes.forEach((cube) => {
        cube.rotation.y += 0.01;
    })

    renderer.render(scene, camera);
}

animate();
