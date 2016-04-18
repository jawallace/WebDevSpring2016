(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .factory('ReadingService', ReadingService);

    ReadingService.$inject = [ '$http', 'UrlService' ];
    function ReadingService($http, UrlService) {

        var service = {
            createReading: createReading,
            getReadingsForGroup: getReadingsForGroup,
            getReadingById: getReadingById,
            updateReading: updateReading,
            deleteReading: deleteReading 
        };

        return service;

        ////////////////////////////////////////
       
        function createReading(loc, book, endDate) {
            return $http
                .post(UrlService.formatUrl(loc) + '/reading', { book: book, endDate: endDate })
                .then(function(res) {
                    return res.data;
                });
        }
        
        function getReadingsForGroup(loc) {
            return $http
                .get(UrlService.formatUrl(loc) + '/reading')
                .then(function(res) {
                    return res.data;
                });
        }

        function getReadingById(loc, reading) {
            var newLoc = angular.copy(loc);
            newLoc.reading = reading;
            
            return $http
                .get(UrlService.formatUrl(newLoc))
                .then(function(res) {
                    return res.data;
                });
        }

        function updateReading(loc, reading, updated) {
            var newLoc = angular.copy(loc);
            newLoc.reading = reading;

            return $http
                .put(UrlService.formatUrl(newLoc), updated)
                .then(function(res) {
                    return res.data;
                });
        }

        function deleteReading(loc, reading) {
            var newLoc = angular.copy(loc);
            newLoc.reading = reading;

            return $http
                .delete(UrlService.formatUrl(newLoc))
                .then(function(res) {
                    return res.data;
                });
        }
    }
}());
