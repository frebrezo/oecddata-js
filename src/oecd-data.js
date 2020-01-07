'use strict';

const fs = require('fs');
var OECDServiceAgent = require('./oecd-service-agent');

function OECDData() {
    const oecdServiceAgent = new OECDServiceAgent();

    this.getDataSet = function (dataSetId) {
        return oecdServiceAgent.getDataSet(dataSetId);
    }

    this.splitSeriesKey = function (seriesKey) {
        var seriesIdArr = seriesKey.split(':');
        return seriesIdArr;
    }

    this.getSeriesKeyIds = function (dimensions) {
        var newSeriesKey = [];
        for (var i = 0; i < dimensions.series.length; ++i) {
            newSeriesKey.push(dimensions.series[i].id);
        }
        return newSeriesKey;
    }

    this.getSeriesKeyCodes = function (seriesKey, dimensions) {
        var seriesIdArr = this.splitSeriesKey(seriesKey);
        var newSeriesKey = [];
        for (var i = 0; i < seriesIdArr.length; ++i) {
            newSeriesKey.push(dimensions.series[i].values[seriesIdArr[i]].id);
        }
        return newSeriesKey;
    }

    this.getSeriesKeyNames = function (seriesKey, dimensions) {
        var seriesIdArr = this.splitSeriesKey(seriesKey);
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

    this.getSeriesKeyCodesMap = function (dataSet) {
        var respJson = dataSet;
        //console.log(respJson.header.id);
        var seriesKeyDict = {};
        var seriesKeyCode = null;
        for (var seriesKey in respJson.dataSets[0].series) {
            seriesKeyCode = this.getSeriesKeyCodes(seriesKey, respJson.structure.dimensions);
            seriesKeyDict[seriesKey] = seriesKeyCode;
        }
        return seriesKeyDict;
    }

    this.getSeriesKeyNamesMap = function (dataSet) {
        var respJson = dataSet;
        //console.log(respJson.header.id);
        var seriesKeyDict = {};
        var seriesKeyName = null;
        for (var seriesKey in respJson.dataSets[0].series) {
            seriesKeyName = this.getSeriesKeyNames(seriesKey, respJson.structure.dimensions);
            seriesKeyDict[seriesKey] = seriesKeyName;
        }
        return seriesKeyDict;
    }

    this.getSeriesAttributeIds = function (attributes) {
        var newSeriesAttr = [];
        for (var i = 0; i < attributes.series.length; ++i) {
            newSeriesAttr.push(attributes.series[i].id);
        }
        return newSeriesAttr;
    } 

    this.getSeriesAttributeNames = function (seriesAttr, attributes) {
        var newSeriesAttr = [];
        for (var i = 0; i < seriesAttr.length; ++i) {
            newSeriesAttr.push(attributes.series[i].name);
        }
        return newSeriesAttr;
    } 

    this.getSeriesAttributeValueCodes = function (seriesAttr, attributes) {
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

    this.getSeriesAttributeValueNames = function (seriesAttr, attributes) {
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
        var header = '';
        var seriesKeyIds = [];
        var seriesAttrIds = [];
        var rowSeriesKey = '';
        var rowSeriesAttr = '';
        var row = '';
        var series = {};
        var splitSeriesKeyArr = [];
        var seriesKeyCodeArr = [];
        var seriesKeyNameArr = [];
        var seriesAttr = [];
        var seriesAttrValueCodes = [];
        var seriesAttrValueNames = [];
        var seriesObs = {};

        let writeStream = fs.createWriteStream(filePath);
        try {
            header = '';
            seriesKeyIds = this.getSeriesKeyIds(respJson.structure.dimensions);
            for (var i = 0; i < seriesKeyIds.length; ++i) {
                if (header) header += ',';
                header += 'SERIESIDX' + i + ',' + seriesKeyIds[i] + '_ID' + ',' + seriesKeyIds[i] + '_NAME';
            }
            seriesAttrIds = this.getSeriesAttributeIds(respJson.structure.attributes);
            for (var i = 0; i < seriesAttrIds.length; ++i) {
                if (header) header += ',';
                header += 'SERIESATTRIDX' + i + ',' + seriesAttrIds[i] + '_ID' + ',' + seriesAttrIds[i] + '_NAME';
            }
            header += ',' + 'SERIESATTRVALIDX' + ',' + 'SERIESATTRVAL';
            writeStream.write(header + '\n');
            series = respJson.dataSets[0].series;
            for (var seriesKey in series) {
                rowSeriesKey = '';
                splitSeriesKeyArr = this.splitSeriesKey(seriesKey);
                seriesKeyCodeArr = this.getSeriesKeyCodes(seriesKey, respJson.structure.dimensions);
                seriesKeyNameArr = this.getSeriesKeyNames(seriesKey, respJson.structure.dimensions);
                for (var seriesKeyCount = 0; seriesKeyCount < seriesKeyCodeArr.length; ++seriesKeyCount) {
                    if (seriesKeyCount > 0) rowSeriesKey += ',';
                    rowSeriesKey += '"' + splitSeriesKeyArr[seriesKeyCount] + '"' + ',' + '"' + seriesKeyCodeArr[seriesKeyCount] + '"' + ',' + '"' + seriesKeyNameArr[seriesKeyCount] + '"';
                }

                rowSeriesAttr = '';
                seriesAttr = series[seriesKey].attributes;
                seriesAttrValueCodes = this.getSeriesAttributeValueCodes(seriesAttr, respJson.structure.attributes);
                seriesAttrValueNames = this.getSeriesAttributeValueNames(seriesAttr, respJson.structure.attributes);
                for (var seriesAttrCount = 0; seriesAttrCount < seriesAttr.length; ++seriesAttrCount) {
                    if (seriesAttrCount > 0) rowSeriesAttr += ',';
                    rowSeriesAttr += '"' + seriesAttr[seriesAttrCount] + '"' + ',' + '"' + seriesAttrValueCodes[seriesAttrCount] + '"' + ',' + '"' + seriesAttrValueNames[seriesAttrCount] + '"';
                }

                seriesObs = series[seriesKey].observations;
                for (var seriesObsKey in seriesObs) {
                    row = rowSeriesKey + ',' + rowSeriesAttr + ',' + seriesObsKey + ',' + '"' + seriesObs[seriesObsKey][0] + '"';
                    writeStream.write(row + '\n');
                }
            }
        } finally {
            if (writeStream) writeStream.end();
        }
    }
}

module.exports = OECDData;

var dataSetId = 'HH_DASH';
var oecdData = new OECDData();
var requestPromise = oecdData.getDataSet(dataSetId);
//https://javascript.info/promise-basics
requestPromise.then(
    result => {
        var respJson = result;
        // console.log(respJson.header.id);
        // var seriesKeyCodeDict = oecdData.getSeriesKeyCodesMap(respJson);
        // var seriesKeyNameDict = oecdData.getSeriesKeyNamesMap(respJson);
        // for (var seriesKey in splitSeriesKeyArrDict) {
        //     console.log(seriesKey + ', ' + oecdData.getSeriesKeyString(seriesKeyCodeDict[seriesKey]) + ', ' + oecdData.getSeriesKeyString(seriesKeyNameDict[seriesKey]));
        // }
        oecdData.writeToCSV(dataSetId + '.csv', respJson);
    },
    error => {
        console.error('PANIC! Something is very wrong here.');
    });
