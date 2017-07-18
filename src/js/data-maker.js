let fs = require('fs')

function makeDoc(id, parentId) {
    return {
        id,
        parentId,
        children: [],
    }
}

let numberOfDocs = process.env.NUMBER_OF_DOCS || 200
const docs = {}

while (numberOfDocs > 0) {
    let ids = Object.keys(docs)
    let randomIndex = Math.floor(Math.random() * ids.length)
    let parentId = ids[randomIndex]
    let doc = makeDoc(numberOfDocs, parentId)

    if (docs[parentId]) {
        docs[parentId].children.push(doc.id)
    }

    docs[doc.id] = doc
    numberOfDocs--
}

fs.writeFile('dummy-data.json', JSON.stringify(docs, null, 4))
