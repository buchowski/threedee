const unit = 0.05
const spaceUnit = unit * 5
const lineageColor = 0xf44152
const geometry = new THREE.OctahedronGeometry(unit)
const torusGeometry = new THREE.TorusKnotGeometry(unit, unit / 3)
const sphereGeometry = new THREE.SphereGeometry(unit)
const materialOne = new THREE.MeshLambertMaterial({ color: 0x2194ce, transparent: true, wireframe: false })
const materialTwo = new THREE.MeshLambertMaterial({ color: 0x09f21d, transparent: true, wireframe: false })
const hoverMaterial = new THREE.MeshLambertMaterial({ color: lineageColor, transparent: true })
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff })
const lineageLineMaterial = new THREE.LineBasicMaterial({ color: lineageColor })
const deltas = [
    [1, 0, 0],
    [1, 0, 1],
    [0, 0, 1],
    [-1, 0, 1],
    [-1, 0, 0],
    [-1, 0, -1],
    [0, 0, -1],
    [1, 0, -1],
]
const lightDeltas = [
    [0, 200, 0],
    [100, 200, 100],
    [-100, -200, -100]
]

export {
    unit,
    spaceUnit,
    lineageColor,
    geometry,
    materialOne,
    materialTwo,
    hoverMaterial,
    lineMaterial,
    lineageLineMaterial,
    deltas,
    lightDeltas,
    torusGeometry,
    sphereGeometry
}
