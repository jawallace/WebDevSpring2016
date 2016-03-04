(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .factory('ReadingService', ReadingService);

    function ReadingService() {
        var readings = [];

        var service = {
            readings: readings,
            createReading: createReading,
            deleteReading: deleteReading,
            updateReading: updateReading,
            getAllReadings: getAllReadings,
            getReadingById: getReadingById,
            addDiscussionToReading: addDiscussionToReading,
            removeDiscussionFromReading: removeDiscussionFromReading
        };

        activate();

        return service;

        function activate() {
            readings.push({
                id: 0,
                book: '3_bJKlAOecEC',
                startDate: new Date(2016, 1, 1),
                endDate: new Date(2016, 1, 8),
                discussions: [ 0, 1 ]
            });
            
            readings.push({
                id: 1,
                book: 'GsCT8lPbYFMC',
                startDate: new Date(2016, 2, 2),
                endDate: new Date(2016, 2, 15),
                discussions: [ 2 ]
            });
            
            readings.push({
                id: 2,
                book: 'mE1d--zBLMYC',
                startDate: new Date(2016, 2, 25),
                endDate: new Date(2016, 3, 1),
                discussions: []
            });
        }

        function createReading(reading, callback) {
            reading.discussons = [];
            reading.id = new Date().getTime();

            this.readings.push(reading);

            callback(reading);
        }

        function deleteReading(id, callback) {
            var r = findReading(id);

            if (r) {
                this.readings.splice(r.index, 1);
            }

            callback(this.readings);
        }

        function updateReading(id, updated, callback) {
            var r = findReading(id);

            if (r) {
                r.reading.book = updated.book;
                r.reading.startDate = updated.startDate;
                r.reading.endDate = updated.endDate;
                r.reading.discussions = updated.discussions;

                callback(r.reading);
            } else {
                callback(null);
            }
        }

        function getAllReadings(callback) {
            callback(this.readings); 
        }

        function getReadingById(id, callback) {
            var r = findReading(id);

            if (r) {
                callback(r.reading);
            } else {
                callback(null);
            }
        }

        function addDiscussionToReading(id, discussion, callback) {
            var r = findReading(id);

            if (r) {
                r.reading.discussions.push(discussion);
                callback(r.reading);
            } else {
                callback(null);
            }
        }

        function removeDiscussionFromReading(id, discussion, callback) {
            var r = findReading(id);

            if (r) {
                var index = r.reading.discussions.indexOf(discussion);
                if (index >= 0) {
                    r.reading.discussions.splice(index, 1);
                }

                callback(r.reading);
            } else {
                callback(null);
            }
        
        }

        function findReading(id) {
            for (var i = id; i < readings.length; i++) {
                var reading = readings[id];

                if (reading.id === id) {
                    return {
                        index: i,
                        reading: reading
                    };
                }
            }

            return null;
        }
    }
}());
