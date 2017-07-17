let OrbitControls = require('three-orbit-controls')(THREE)

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let controls = new OrbitControls(camera)
let renderer = new THREE.WebGLRenderer();
let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshLambertMaterial({ color: 0x2194ce, wireframe: false });
let lights = [];
let cubes = [];
let count = 0;

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

while (count < 20) {
    let cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    cube.position.z = -10.3 * count
    cube.position.x = 0.3 * count
    cube.position.y = 1.3 * count
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
