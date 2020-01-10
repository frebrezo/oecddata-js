'use strict';

const fs = require('fs');

function OECDDataService() {
    this.getName = function (dataSet) {
        return dataSet.structure.name;
    }

    this.getDescription = function (dataSet) {
        return dataSet.structure.description;
    }

    this.getDimensions = function (dataSet) {
        return dataSet.structure.dimensions;
    }

    this.getAttributes = function (dataSet) {
        return dataSet.structure.attributes;
    }

    this.getDataSetCount = function (dataSet) {
        return dataSet.dataSets.length;
    }

    this.getSeriesCount = function (dataSet, dataSetIndex = 0) {
        return dataSet.dataSets[dataSetIndex].series.length;
    }

    this.getObservationCount = function (dataSet, seriesIndex, dataSetIndex = 0) {
        return dataSet.dataSets[dataSetIndex].series[seriesIndex].observations.length;
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

    this.getSeriesKeyCodesMap = function (dataSet, dataSetIndex = 0) {
        var seriesKeyDict = {};
        var seriesKeyCode = null;
        for (var seriesKey in dataSet.dataSets[dataSetIndex].series) {
            seriesKeyCode = this.getSeriesKeyCodes(seriesKey, dataSet.structure.dimensions);
            seriesKeyDict[seriesKey] = seriesKeyCode;
        }
        return seriesKeyDict;
    }

    this.getSeriesKeyNamesMap = function (dataSet, dataSetIndex = 0) {
        var seriesKeyDict = {};
        var seriesKeyName = null;
        for (var seriesKey in dataSet.dataSets[dataSetIndex].series) {
            seriesKeyName = this.getSeriesKeyNames(seriesKey, dataSet.structure.dimensions);
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

    this.writeToCSV = function (filePath, dataSet, dataSetIndex = 0) {
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

        var dimensions = this.getDimensions(dataSet);
        var attributes = this.getAttributes(dataSet);
        let writeStream = fs.createWriteStream(filePath);
        try {
            header = '';
            seriesKeyIds = this.getSeriesKeyIds(dimensions);
            for (var i = 0; i < seriesKeyIds.length; ++i) {
                if (header) header += ',';
                header += 'SERIESIDX' + i + ',' + seriesKeyIds[i] + '_ID' + ',' + seriesKeyIds[i] + '_NAME';
            }
            seriesAttrIds = this.getSeriesAttributeIds(attributes);
            for (var i = 0; i < seriesAttrIds.length; ++i) {
                if (header) header += ',';
                header += 'SERIESATTRIDX' + i + ',' + seriesAttrIds[i] + '_ID' + ',' + seriesAttrIds[i] + '_NAME';
            }
            header += ',' + 'SERIESATTRVALIDX' + ',' + 'SERIESATTRVAL';
            writeStream.write(header + '\n');
            series = dataSet.dataSets[dataSetIndex].series;
            for (var seriesKey in series) {
                rowSeriesKey = '';
                splitSeriesKeyArr = this.splitSeriesKey(seriesKey);
                seriesKeyCodeArr = this.getSeriesKeyCodes(seriesKey, dimensions);
                seriesKeyNameArr = this.getSeriesKeyNames(seriesKey, dimensions);
                for (var seriesKeyCount = 0; seriesKeyCount < seriesKeyCodeArr.length; ++seriesKeyCount) {
                    if (seriesKeyCount > 0) rowSeriesKey += ',';
                    rowSeriesKey += '"' + (splitSeriesKeyArr[seriesKeyCount] !== null ? splitSeriesKeyArr[seriesKeyCount] : '') + '"';
                    rowSeriesKey += ',' + '"' + (seriesKeyCodeArr[seriesKeyCount] !== null ? seriesKeyCodeArr[seriesKeyCount] : '') + '"';
                    rowSeriesKey += ',' + '"' + (seriesKeyNameArr[seriesKeyCount] !== null ? seriesKeyNameArr[seriesKeyCount] : '') + '"';
                }

                rowSeriesAttr = '';
                seriesAttr = series[seriesKey].attributes;
                seriesAttrValueCodes = this.getSeriesAttributeValueCodes(seriesAttr, attributes);
                seriesAttrValueNames = this.getSeriesAttributeValueNames(seriesAttr, attributes);
                for (var seriesAttrCount = 0; seriesAttrCount < seriesAttr.length; ++seriesAttrCount) {
                    if (seriesAttrCount > 0) rowSeriesAttr += ',';
                    rowSeriesAttr += '"' + (seriesAttr[seriesAttrCount] !== null ? seriesAttr[seriesAttrCount] : '') + '"';
                    rowSeriesAttr += ',' + '"' + (seriesAttrValueCodes[seriesAttrCount] !== null ? seriesAttrValueCodes[seriesAttrCount] : '') + '"';
                    rowSeriesAttr += ',' + '"' + (seriesAttrValueNames[seriesAttrCount] !== null ? seriesAttrValueNames[seriesAttrCount] : '') + '"';
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

module.exports = OECDDataService;
