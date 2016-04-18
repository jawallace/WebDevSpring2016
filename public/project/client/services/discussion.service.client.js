(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .factory('DiscussionService', DiscussionService);

    DiscussionService.$inject = [ '$http', 'UrlService' ];
    function DiscussionService($http, UrlService) {
    
        var service = {
            createDiscussion: createDiscussion,
            getDiscussionsForReading: getDiscussionsForReading,
            getDiscussionById: getDiscussionById,
            updateDiscussion: updateDiscussion,
            deleteDiscussion: deleteDiscussion
        };

        return service;

        /////////////////////////////////////////////////////
       
        function createDiscussion(loc, topic) {
            return $http
                .post(UrlService.formatUrl(loc) + '/discussion', { topic: topic })
                .then(function(res) {
                    return res.data;
                });
        }
        
        function getDiscussionsForReading(loc) {
            return $http
                .get(UrlService.formatUrl(loc) + '/discussion')
                .then(function(res) {
                    return res.data;
                });
        }

        function getDiscussionById(loc, discussion) {
            var newLoc = angular.copy(loc);
            newLoc.discussion = discussion;

            return $http
                .get(UrlService.formatUrl(newLoc))
                .then(function(res) {
                    return res.data;
                });
        }

        function updateDiscussion(loc, discussion, updatedDiscussion) {
            var newLoc = angular.copy(loc);
            newLoc.discussion = discussion;

            return $http
                .put(UrlService.formatUrl(newLoc), updatedDiscussion)
                .then(function(res) {
                    return res.data;
                });
        }
        
        function deleteDiscussion(loc, discussion) {
            var newLoc = angular.copy(loc);
            newLoc.discussion = discussion;

            return $http
                .delete(UrlService.formatUrl(newLoc))
                .then(function(res) {
                    return res.data;
                });
        }

    }

}());
