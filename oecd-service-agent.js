'use strict';

var request = require('request');

function OECDServiceAgent() {
    this.getDataSet = function (dataSetId) {
        var path = '/SDMX-JSON/data/' + dataSetId;
        //console.log(path);

        var requestPromise = new Promise((resolve, reject) => {
            request('https://stats.oecd.org' + path,
                function (error, response, body) {
                    if (error) {
                        console.error('error:', error); // Print the error if one occurred
                        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                        console.log(body);
                    }
                    resolve(JSON.parse(body));
                });
        });

        return requestPromise;
    }
}

module.exports = OECDServiceAgent;
