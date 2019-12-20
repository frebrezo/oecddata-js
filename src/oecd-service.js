var request = require('request');

var getSeriesKeyId = function (seriesKey, dimensions) {
    var seriesIdArr = seriesKey.split(':');
    var newSeriesKey = '';
    for (var i = 0; i < seriesIdArr.length; ++i) {
        if (newSeriesKey.length > 0) newSeriesKey += ':';
        newSeriesKey += dimensions.series[i].values[seriesIdArr[i]].id;
    }
    return newSeriesKey;
}

var getSeriesKeyName = function (seriesKey, dimensions) {
    var seriesIdArr = seriesKey.split(':');
    var newSeriesKey = '';
    for (var i = 0; i < seriesIdArr.length; ++i) {
        if (newSeriesKey.length > 0) newSeriesKey += ':';
        newSeriesKey += dimensions.series[i].values[seriesIdArr[i]].name;
    }
    return newSeriesKey;
}

var processDataSet = function (dataSetId) {
    var path = '/SDMX-JSON/data/' + dataSetId;
    console.log(path);

    var requestPromise = new Promise((resolve, reject) => {
        request('https://stats.oecd.org' + path,
            function (error, response, body) {
                console.error('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                resolve(body);
            });
    });

    //https://javascript.info/promise-basics
    requestPromise.then(
        result => {
            console.log(result);
            respJson = JSON.parse(result);
            console.log(respJson.header.id);
            for (seriesKey in respJson.dataSets[0].series) {
                var seriesKeyId = getSeriesKeyId(seriesKey, respJson.structure.dimensions);
                var seriesKeyName = getSeriesKeyName(seriesKey, respJson.structure.dimensions);
                console.log(seriesKey + ', ' + seriesKeyId + ', ' + seriesKeyName);
            }
        },
        error => {
            console.error('PANIC! Something is very wrong here.');
        });
}

var dataSetId = 'HH_DASH';
processDataSet(dataSetId);
