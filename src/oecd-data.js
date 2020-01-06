'use strict';

var oecdService = require('./oecd-service-agent');

function OECDData() {
    const oecdServiceAgentObj = new oecdService.OECDServiceAgent();

    this.getDataSet = function (dataSetId) {
        return oecdServiceAgentObj.getDataSet(dataSetId);
    }

    this.getSeriesKeyId = function (seriesKey, dimensions) {
        var seriesIdArr = seriesKey.split(':');
        var newSeriesKey = '';
        for (var i = 0; i < seriesIdArr.length; ++i) {
            if (newSeriesKey.length > 0) newSeriesKey += ':';
            newSeriesKey += dimensions.series[i].values[seriesIdArr[i]].id;
        }
        return newSeriesKey;
    }

    this.getSeriesKeyName = function (seriesKey, dimensions) {
        var seriesIdArr = seriesKey.split(':');
        var newSeriesKey = '';
        for (var i = 0; i < seriesIdArr.length; ++i) {
            if (newSeriesKey.length > 0) newSeriesKey += ':';
            newSeriesKey += dimensions.series[i].values[seriesIdArr[i]].name;
        }
        return newSeriesKey;
    }

    this.getSeriesKeyIds = function(dataSet) {
        var respJson = dataSet;
        console.log(respJson.header.id);
        var seriesKeyDict = {};
        var seriesKeyId = null;
        for (var seriesKey in respJson.dataSets[0].series) {
            seriesKeyId = this.getSeriesKeyId(seriesKey, respJson.structure.dimensions);
            seriesKeyDict[seriesKey] = seriesKeyId;
        }
        return seriesKeyDict;
    }

    this.getSeriesKeyNames = function(dataSet) {
        var respJson = dataSet;
        console.log(respJson.header.id);
        var seriesKeyDict = {};
        var seriesKeyName = null;
        for (var seriesKey in respJson.dataSets[0].series) {
            seriesKeyName = this.getSeriesKeyName(seriesKey, respJson.structure.dimensions);
            seriesKeyDict[seriesKey] = seriesKeyName;
        }
        return seriesKeyDict;
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
        console.log(respJson.header.id);
        var seriesKeyId = oecdDataObj.getSeriesKeyIds(respJson);
        var seriesKeyName = oecdDataObj.getSeriesKeyNames(respJson);
        for (var seriesKey in seriesKeyId) {
            console.log(seriesKey + ', ' + seriesKeyId[seriesKey] + ', ' + seriesKeyName[seriesKey]);
        }
    },
    error => {
        console.error('PANIC! Something is very wrong here.');
    });
