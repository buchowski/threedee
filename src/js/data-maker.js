let fs = require('fs')

function makeDoc(id, parentId) {
    return {
        id,
        parentId,
    }
}

let numberOfDocs = process.env.NUMBER_OF_DOCS || 200
const docs = {}

while (numberOfDocs > 0) {
    let ids = Object.keys(docs)
    let randomIndex = Math.floor(Math.random() * ids.length)
    let doc = makeDoc(numberOfDocs, ids[randomIndex])

    docs[doc.id] = doc
    numberOfDocs--
}

fs.writeFile('dummy-data.json', JSON.stringify(docs, null, 4))
