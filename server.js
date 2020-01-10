const express = require('express');
const app = express();
const OECDData = require('./oecd-data');

var oecdData = new OECDData();

app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});

app.get('/:dataSetId', (req, res) => {
    res.send('Retrieving ' + req.params.dataSetId);
});

app.get('/:dataSetId/metadata/dimensions', (req, res) => {
    var dataSetId = req.params.dataSetId;
    var dataSetPromise = oecdData.getDataSet(dataSetId);
    //https://javascript.info/promise-basics
    dataSetPromise.then(result => {
        var dimensions = oecdData.getDimensions(result);
        res.send(dimensions);
    });
});

app.get('/:dataSetId/metadata/attributes', (req, res) => {
    var dataSetId = req.params.dataSetId;
    var dataSetPromise = oecdData.getDataSet(dataSetId);
    //https://javascript.info/promise-basics
    dataSetPromise.then(result => {
        var attributes = oecdData.getAttributes(result);
        res.send(attributes);
    });
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
