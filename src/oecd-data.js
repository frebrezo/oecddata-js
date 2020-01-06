'use strict';

const fs = require('fs');
var oecdService = require('./oecd-service-agent');

function OECDData() {
    const oecdServiceAgentObj = new oecdService.OECDServiceAgent();

    this.getDataSet = function (dataSetId) {
        return oecdServiceAgentObj.getDataSet(dataSetId);
    }

    this.getSeriesKeyId = function (seriesKey) {
        var seriesIdArr = seriesKey.split(':');
        return seriesIdArr;
    }

    this.getSeriesKeyCode = function (seriesKey, dimensions) {
        var seriesIdArr = this.getSeriesKeyId(seriesKey);
        var newSeriesKey = [];
        for (var i = 0; i < seriesIdArr.length; ++i) {
            newSeriesKey.push(dimensions.series[i].values[seriesIdArr[i]].id);
        }
        return newSeriesKey;
    }

    this.getSeriesKeyName = function (seriesKey, dimensions) {
        var seriesIdArr = this.getSeriesKeyId(seriesKey);
        var newSeriesKey = [];
        for (var i = 0; i < seriesIdArr.length; ++i) {
            newSeriesKey.push(dimensions.series[i].values[seriesIdArr[i]].name);
        }
        return newSeriesKey;
    }

    this.getSeriesKeyString = function (seriesKey) {
        var seriesKeyStr = '';
        for (var i = 0; i < seriesKey.length; ++i) {
            if (i > 0) seriesKeyStr += ':';
            seriesKeyStr += seriesKey[i];
        }
        return seriesKeyStr;
    }

    this.getSeriesKeyCodes = function (dataSet) {
        var respJson = dataSet;
        //console.log(respJson.header.id);
        var seriesKeyDict = {};
        var seriesKeyCode = null;
        for (var seriesKey in respJson.dataSets[0].series) {
            seriesKeyCode = this.getSeriesKeyCode(seriesKey, respJson.structure.dimensions);
            seriesKeyDict[seriesKey] = seriesKeyCode;
        }
        return seriesKeyDict;
    }

    this.getSeriesKeyNames = function (dataSet) {
        var respJson = dataSet;
        //console.log(respJson.header.id);
        var seriesKeyDict = {};
        var seriesKeyName = null;
        for (var seriesKey in respJson.dataSets[0].series) {
            seriesKeyName = this.getSeriesKeyName(seriesKey, respJson.structure.dimensions);
            seriesKeyDict[seriesKey] = seriesKeyName;
        }
        return seriesKeyDict;
    }

    this.getSeriesAttributeId = function (seriesAttr, attributes) {
        var newSeriesAttr = [];
        for (var i = 0; i < seriesAttr.length; ++i) {
            newSeriesAttr.push(attributes.series[i].id);
        }
        return newSeriesAttr;
    } 

    this.getSeriesAttributeName = function (seriesAttr, attributes) {
        var newSeriesAttr = [];
        for (var i = 0; i < seriesAttr.length; ++i) {
            newSeriesAttr.push(attributes.series[i].name);
        }
        return newSeriesAttr;
    } 

    this.getSeriesAttributeValueCode = function (seriesAttr, attributes) {
        var newSeriesAttr = [];
        for (var i = 0; i < seriesAttr.length; ++i) {
            if (seriesAttr[i] != null) {
                newSeriesAttr.push(attributes.series[i].values[seriesAttr[i]].id);
            } else {
                newSeriesAttr.push(null);
            }
        }
        return newSeriesAttr;
    }

    this.getSeriesAttributeValueName = function (seriesAttr, attributes) {
        var newSeriesAttr = [];
        for (var i = 0; i < seriesAttr.length; ++i) {
            if (seriesAttr[i] != null) {
                newSeriesAttr.push(attributes.series[i].values[seriesAttr[i]].name);
            } else {
                newSeriesAttr.push(null);
            }
        }
        return newSeriesAttr;
    }

    this.writeToCSV = function (filePath, dataSet) {
        var respJson = dataSet;
        var rowSeriesKey = '';
        var rowSeriesAttr = '';
        var row = '';
        var series = {};
        var seriesKeyId = [];
        var seriesKeyCode = [];
        var seriesKeyName = [];
        var seriesAttr = [];
        var seriesAttrValueCode = [];
        var seriesAttrValueName = [];
        var seriesObs = {};

        let writeStream = fs.createWriteStream(filePath);
        try {
            series = respJson.dataSets[0].series;
            for (var seriesKey in series) {
                rowSeriesKey = '';
                seriesKeyId = this.getSeriesKeyId(seriesKey);
                seriesKeyCode = this.getSeriesKeyCode(seriesKey, respJson.structure.dimensions);
                seriesKeyName = this.getSeriesKeyName(seriesKey, respJson.structure.dimensions);
                for (var seriesKeyCount = 0; seriesKeyCount < seriesKeyCode.length; ++seriesKeyCount) {
                    if (seriesKeyCount > 0) rowSeriesKey += ',';
                    rowSeriesKey += seriesKeyId[seriesKeyCount] + ',' + seriesKeyCode[seriesKeyCount] + ',' + seriesKeyName[seriesKeyCount];
                }

                rowSeriesAttr = '';
                seriesAttr = series[seriesKey].attributes;
                seriesAttrValueCode = this.getSeriesAttributeValueCode(seriesAttr, respJson.structure.attributes);
                seriesAttrValueName = this.getSeriesAttributeValueName(seriesAttr, respJson.structure.attributes);
                for (var seriesAttrCount = 0; seriesAttrCount < seriesAttr.length; ++seriesAttrCount) {
                    if (seriesAttrCount > 0) rowSeriesAttr += ',';
                    rowSeriesAttr += seriesAttr[seriesAttrCount] + ',' + seriesAttrValueCode[seriesAttrCount] + ',' + seriesAttrValueName[seriesAttrCount];
                }

                seriesObs = series[seriesKey].observations;
                for (var seriesObsKey in seriesObs) {
                    row = rowSeriesKey + ',' + rowSeriesAttr + ',' + seriesObsKey + ',' + seriesObs[seriesObsKey][0];
                    writeStream.write(row + '\n');
                }
            }
        } finally {
            if (writeStream) writeStream.end();
        }
    }
}

module.exports.OECDData = OECDData;

var dataSetId = 'HH_DASH';
var oecdDataObj = new OECDData();
var requestPromise = oecdDataObj.getDataSet(dataSetId);
//https://javascript.info/promise-basics
requestPromise.then(
    result => {
        var respJson = result;
        // console.log(respJson.header.id);
        // var seriesKeyCodeDict = oecdDataObj.getSeriesKeyCodes(respJson);
        // var seriesKeyNameDict = oecdDataObj.getSeriesKeyNames(respJson);
        // for (var seriesKey in seriesKeyIdDict) {
        //     console.log(seriesKey + ', ' + oecdDataObj.getSeriesKeyString(seriesKeyCodeDict[seriesKey]) + ', ' + oecdDataObj.getSeriesKeyString(seriesKeyNameDict[seriesKey]));
        // }
        oecdDataObj.writeToCSV(dataSetId + '.csv', respJson);
    },
    error => {
        console.error('PANIC! Something is very wrong here.');
    });
