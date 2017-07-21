let fs = require('fs')
let authors = [
    {
        name: 'Bobby Budnick',
        photo: ''
    },
    {
        name: 'Brian Brandes',
        photo: ''
    },
    {
        name: 'Dr. Steve Brule',
        photo: ''
    }
]
let numberOfDocs = process.env.NUMBER_OF_DOCS || 200
const docs = {}

function makeDoc(id, parentId) {
    const twoYears = 6.307e+10
    let author = authors[Math.floor(Math.random() * authors.length)]
    let timestamp

    if (parentId) {
        let parentTime = docs[parentId].timestamp
        let step = Math.random() * twoYears

        timestamp = parentTime + step
    } else {
        timestamp = Date.parse(new Date(1984, 5, 17).toString())
    }

    return {
        id,
        parentId,
        children: [],
        author,
        timestamp
    }
}

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
