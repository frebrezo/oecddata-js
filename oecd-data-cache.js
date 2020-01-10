'use strict';

const NodeCache = require('node-cache');
const OECDData = require('./oecd-data');

function OECDDataCache() {
    const cache = new NodeCache({ stdTTL: 60, useClones: false });
    const oecdData = new OECDData();

    this.getDataSet = function (dataSetId) {
        var dataSetPromise = null;
        var dataSet = cache.get(dataSetId);
        if (!dataSet) {
            dataSetPromise = oecdData.getDataSet(dataSetId)
            dataSetPromise = dataSetPromise.then(result => {
                cache.set(dataSetId, result);
                return result;
            });
        } else {
            dataSetPromise = new Promise(function(resolve, reject) {
                resolve(dataSet);
            });
        }
        return dataSetPromise;
    }
}

module.exports = OECDDataCache;
