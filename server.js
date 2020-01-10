const express = require('express');
const app = express();
const OECDData = require('./oecd-data');

app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});

app.get('/:dataSetId', (req, res) => {
    res.send('Retrieving ' + req.params.dataSetId);
});

app.get('/:dataSetId/metadata', (req, res) => {
    var dataSetId = req.params.dataSetId;
    var oecdData = new OECDData();
    var dataSetPromise = oecdData.getDataSet(dataSetId);
    //https://javascript.info/promise-basics
    dataSetPromise.then(
        dataSet => {
            var dimensions = oecdData.getDimensions(dataSet);
            res.send(dimensions);
        }, error => {
            console.error('PANIC! Something is very wrong here.');
        });
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
