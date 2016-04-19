(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .factory('CommentService', CommentService);

    CommentService.$inject = [ '$http', 'UrlService' ];
    function CommentService($http, UrlService) {
        
        var service = {
            createComment: createComment,
            getCommentsForDiscussion: getCommentsForDiscussion,
            getCommentById: getCommentById,
            getCommentsForUser: getCommentsForUser,
            updateComment: updateComment,
            deleteComment: deleteComment
        };

        return service;

        //////////////////// IMPLEMENTATION ////////////////////

        function createComment(loc, text) {
            return $http
                .post(UrlService.formatUrl(loc) + '/comment', { text: text })
                .then(function(res) {
                    return res.data;
                });
        }

        function getCommentsForDiscussion(loc) {
            return $http
                .get(UrlService.formatUrl(loc) + '/comment')
                .then(function(res) {
                    return res.data;
                });
        }
       
        function getCommentById(loc, comment) {
            var newLoc = angular.copy(loc);
            newLoc.comment = comment;
            return $http
                .get(UrlService.formatUrl(newLoc))
                .then(function(res) {
                    return res.data;
                });
        }

        function getCommentsForUser(userId) {
            return $http
                .get('/api/project/user/' + userId + '/comment')
                .then(function(res) {
                    return res.data;
                });
        }
        
        function updateComment(loc, comment, newComment) {
            var newLoc = angular.copy(loc);
            newLoc.comment = comment;
            return $http
                .put(UrlService.formatUrl(newLoc), newComment)
                .then(function(res) {
                    return res.data;
                });
        }
        
        function deleteComment(loc, comment) {
            var newLoc = angular.copy(loc);
            newLoc.comment = comment;

            return $http
                .delete(UrlService.formatUrl(newLoc))
                .then(function(res) {
                    return res.data;
                });
        }
    }

}());
