import {
    spaceUnit, deltas
} from './constants'

let takenPositions = []

function isPositionTaken(x, y, z) {
    let positionString = [x, y, z].join(',')

    return takenPositions.indexOf(positionString) !== -1
}

function calcBlobPosition(proposedX, proposedY, proposedZ) {
    let acceptedX = proposedX
    let acceptedY = proposedY
    let acceptedZ = proposedZ
    let deltaIndex = 0
    let specialYDelta = 0

    while (isPositionTaken(acceptedX, acceptedY, acceptedZ)) {
        let [deltaX, deltaY, deltaZ] = deltas[deltaIndex]

        acceptedX = proposedX + deltaX * spaceUnit
        acceptedY = proposedY + specialYDelta * spaceUnit
        acceptedZ = proposedZ + deltaZ * spaceUnit
        deltaIndex++

        if (deltaIndex >= deltas.length) {
            deltaIndex = 0
            specialYDelta -= 1
        }
    }

    takenPositions.push([acceptedX, acceptedY, acceptedZ].join(','))
    return { acceptedX, acceptedY, acceptedZ }
}



function calcBlobPositionAlt(proposedX, proposedY, proposedZ, siblingId, siblingCount) {
    let acceptedX = proposedX + spaceUnit * Math.cos(2 * Math.PI * siblingId / siblingCount)
    let acceptedY = proposedY
    let acceptedZ = proposedZ + spaceUnit * Math.sin(2 * Math.PI * siblingId / siblingCount)
    return { acceptedX, acceptedY, acceptedZ }
}


// simply export a different function when you want a different positioning algorithm
export default calcBlobPositionAlt
