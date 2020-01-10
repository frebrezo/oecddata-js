const express = require('express');
const OECDDataCache = require('./oecd-data-cache');
const OECDDataService = require ('./oecd-data-service');

const app = express();
const oecdData = new OECDDataCache();
const oecdDataService = new OECDDataService();

app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});

app.get('/data/:dataSetId', (req, res) => {
    var dataSetId = req.params.dataSetId;
    console.log('/data/' + dataSetId);
    var dataSetPromise = oecdData.getDataSet(dataSetId);
    dataSetPromise.then(result => {
        res.send(result);
    });
});

app.get('/data/:dataSetId/metadata/dimensions', (req, res) => {
    var dataSetId = req.params.dataSetId;
    console.log('/data/' + dataSetId + '/metadata/dimensions');
    var dataSetPromise = oecdData.getDataSet(dataSetId);
    dataSetPromise.then(result => {
        var dimensions = oecdDataService.getDimensions(result);
        res.send(dimensions);
    });
});

app.get('/data/:dataSetId/metadata/attributes', (req, res) => {
    var dataSetId = req.params.dataSetId;
    console.log('/data/' + dataSetId + '/metadata/attributes');
    var dataSetPromise = oecdData.getDataSet(dataSetId);
    dataSetPromise.then(result => {
        var attributes = oecdDataService.getAttributes(result);
        res.send(attributes);
    });
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
