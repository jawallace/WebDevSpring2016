module.exports = function(mongoose) {
    'use strict';

    var utils = require('../../utils/util.js')();
    var ReadingModel = require('./reading.schema.js')(mongoose);

    var service = utils.deferService({
        create: createReading,
        delete: deleteReading,
        update: updateReading,
        findAll: getAllReadings,
        findById: getReadingById,
        findByGroup: getReadingsForGroup,
        findCurrentForGroup: getCurrentReading
    });

    return service;

    /////////////////////////////////////////
    
    function createReading(resolve, reject, reading) {
        ReadingModel.create(reading, function(err, reading) {
            return err ? reject(err) : resolve(reading);
        });
    }

    function deleteReading(resolve, reject, id) {
        ReadingModel.findById(id).remove(function(err) {
            ReadingModel.find(function(err, readings) {
                return err ? reject(err) : resolve(readings);   
            });
        });
    }

    function updateReading(resolve, reject, id, updated) {
        ReadingModel.findById(id, function(err, reading) {
            if (err) {
                return reject(err);
            }

            utils.extend(reading, updated);

            reading.save(function(err, updatedReading) {
                return err ? reject(err) : resolve(reading); 
            });
        });
    }

    function getAllReadings(resolve, reject) {
        ReadingModel.find({}, null, { sort: '-startDate' }, function(err, readings) {
            return err ? reject(err) : resolve(readings); 
        });
    }

    function getReadingById(resolve, reject, id) {
        ReadingModel.findById(id, function(err, reading) {
            return err ? reject(err) : resolve(reading); 
        });
    }

    function getReadingsForGroup(resolve, reject, group) {
        ReadingModel.find({ group: group }, null, { sort: '-startDate' }, function(err, readings) {
            return err ? reject(err) : resolve(readings); 
        });
    }
    
    function getCurrentReading(resolve, reject, group) {
        ReadingModel.findOne({ group: group }, null, { sort: '-startDate' }, function(err, reading) {
            return err ? reject(err) : resolve(reading); 
        });
    }
}
