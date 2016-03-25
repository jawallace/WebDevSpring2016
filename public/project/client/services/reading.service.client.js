(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .factory('ReadingService', ReadingService);

    ReadingService.$inject = [ '$http' ];
    function ReadingService($http) {

        var BASE_URL = '/api/project/reading';

        var service = {
            updateReading: updateReading,
            getAllReadings: getAllReadings,
            getReadingById: getReadingById,
            getDiscussionsForReading: getDiscussionsForReading,
            addDiscussionToReading: addDiscussionToReading,
            removeDiscussionFromReading: removeDiscussionFromReading
        };

        activate();

        return service;

        ////////////////////////////////////////
        
        function activate() {
        }

        function updateReading(id, updated) {
            return $http
                .put(BASE_URL + '/' + id, updated)
                .then(function(res) {
                    return res.data;
                });
        }

        function getAllReadings() {
            return $http
                .get(BASE_URL)
                .then(function(res) {
                    return res.data;
                });
        }

        function getReadingById(id) {
            return $http
                .get(BASE_URL + '/' + id)
                .then(function(res) {
                    return res.data;
                });
        }

        function addDiscussionToReading(id, discussion) {
            return $http
                .post(BASE_URL + '/' + id + '/discussion', discussion)
                .then(function(res) {
                    return res.data;
                });
        }

        function removeDiscussionFromReading(id, discussion) {
            return $http
                .delete(BASE_URL + '/' + id + '/discussion/' + discussion)
                .then(function(res) {
                    return res.data;
                });
        }

        function getDiscussionsForReading(id) {
            return $http
                .get(BASE_URL + '/' + id + '/discussion')
                .then(function(res) {
                    return res.data;
                });
        }
    }
}());
