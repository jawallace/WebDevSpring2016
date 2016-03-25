(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .factory('DiscussionService', DiscussionService);

    DiscussionService.$inject = [ '$http' ];
    function DiscussionService($http) {
    
        var baseUrl = '/api/project/discussion';

        var service = {
            getDiscussionById: getDiscussionById,
            getAllDiscussions: getAllDiscussions,
            createDiscussion: createDiscussion,
            updateDiscussion: updateDiscussion,
            deleteDiscussion: deleteDiscussion,
            getCommentsForDiscussion: getCommentsForDiscussion,
            addCommentToDiscussion: addCommentToDiscussion,
            removeCommentFromDiscussion: removeCommentFromDiscussion
        };

        activate();

        return service;

        /////////////////////////////////////////////////////
        
        function activate() {
        }

        function createDiscussion(userId, topic) {
            var discussion = {
                user: userId,
                topic: topic,
                comments: []
            };

            //TODO
            console.log('TODO');
        }

        function getDiscussionById(id) {
            return $http
                .get(baseUrl + '/' + id)
                .then(function(res) {
                    return res.data;
                });
        }

        function getAllDiscussions() {
            return $http
                .get(baseUrl)
                .then(function(res) {
                    return res.data;
                });
        }

        function updateDiscussion(id, updatedDiscussion) {
            return $http
                .put(baseUrl + '/' + id, updateDiscussion)
                .then(function(res) {
                    return res.data;
                });
        }

        function deleteDiscussion(id, callback) {
            //TODO
            console.log('TODO');
        }
        
        function getCommentsForDiscussion(id) {
            return $http
                .get(baseUrl + '/' + id + '/comment')
                .then(function(res) {
                    return res.data;
                });
        }

        function addCommentToDiscussion(id, comment) {
            return $http
                .post(baseUrl + '/' + id + '/comment', comment)
                .then(function(res) {
                    return res.data;
                });
        }

        function removeCommentFromDiscussion(id, commentId) {
            return $http
                .delete(baseUrl + '/' + id + '/comment/' + commentId)
                .then(function(res) {
                    return res.data;
                });
        }

    }

}());
