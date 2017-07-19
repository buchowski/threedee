const dummyData = require('./dummy-data.json')
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('dist'));

app.get('/dummy-data', (req, res) => {
    res.json(dummyData)
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
