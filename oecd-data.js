'use strict';

const OECDServiceAgent = require('./oecd-service-agent');

function OECDData() {
    const oecdServiceAgent = new OECDServiceAgent();

    this.getDataSet = function (dataSetId) {
        return oecdServiceAgent.getDataSet(dataSetId);
    }
}

module.exports = OECDData;
