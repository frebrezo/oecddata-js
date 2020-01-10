'use strict';

const fs = require('fs');
const OECDData = require('../oecd-data');
const OECDDataService = require('../oecd-data-service');

var oecdData = new OECDData();
var oecdDataService = new OECDDataService();

describe('oecd-data-service', function() {
    describe('writeToCSV', function() {
        it('file exists', function(done) {
            var dataSetId = 'HH_DASH';
            console.log(dataSetId);
            var filePath = dataSetId + '.csv';
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            var dataSetPromise = oecdData.getDataSet(dataSetId);
            //https://javascript.info/promise-basics
            dataSetPromise.then(result => {
                console.log(result.header.id);
                oecdDataService.writeToCSV(dataSetId + '.csv', result);
                return filePath;
            }).then(result => {
                var fileExists = fs.existsSync(result);
                console.log(fileExists);
                expect(fileExists).toBeTrue();
            }).finally(() => {
                done();
            });
        });
    });
});
