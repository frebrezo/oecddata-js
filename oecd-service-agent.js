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
                        console.error('statusCode:', response.statusCode); // Print the response status code if a response was received
                        console.error(body);
                        resolve(null);
                    } else {
                        try {
                            resolve(JSON.parse(body));
                        } catch (e) {
                            console.error(body);
                            resolve(null);
                        }
                    }
                });
        });

        return requestPromise;
    }
}

module.exports = OECDServiceAgent;
