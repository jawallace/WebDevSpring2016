module.exports = function() {
    'use strict';

    var utils = require('./util.js')();

    var readings = [];

    var service = {
        readings: readings,
        create: createReading,
        delete: deleteReading,
        update: updateReading,
        findAll: getAllReadings,
        findById: getReadingById,
        addDiscussion: addDiscussionToReading,
        removeDiscussion: removeDiscussionFromReading
    };

    activate();

    return service;

    /////////////////////////////////////////
    
    function activate() {
        var mock = require('./reading.mock.json');
        
        for (var i = 0; i < mock.length; i++) {
            mock.startDate = new Date(mock.startDate);
            mock.endDate= new Date(mock.endDate);
            readings.push(mock[i]);
        }

    }

    function createReading(reading) {
        reading.discussons = [];
        reading.id = utils.guid();

        this.readings.push(reading);
        
        return reading;
    }

    function deleteReading(id) {
        var r = utils.findById(readings, id);

        if (r) {
            this.readings.splice(r.index, 1);
            return r.value;
        }
    }

    function updateReading(id, updated) {
        var r = utils.findById(readings, id);

        if (r) {
            utils.extend(r.value, updated);
            return r.value;
        }
    }

    function getAllReadings() {
        return this.readings;
    }

    function getReadingById(id) {
        var r = utils.findById(readings, id);

        if (r) {
            return r.value;
        }
    }

    function addDiscussionToReading(id, discussion) {
        var r = utils.findById(readings, id);

        if (r) {
            r.value.discussions.push(discussion);
            return r.value;
        }
    }

    function removeDiscussionFromReading(id, discussion) {
        var r = utils.findById(readings, id);
        
        if (r) {
            var index = r.value.discussions.indexOf(discussion);
            if (index >= 0) {
                r.value.discussions.splice(index, 1);
            }

            return r.value;
        }
    
    }

}
