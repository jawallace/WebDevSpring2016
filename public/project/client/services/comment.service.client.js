(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .factory('CommentService', CommentService);

    CommentService.$inject = [ '$http' ];
    function CommentService($http) {

        var baseUrl = '/api/project/comment';

        var service = {
            getAllComments: getAllComments,
            getCommentById: getCommentById,
            getCommentsForUser: getCommentsForUser,
            updateComment: updateComment
        };

        activate();

        return service;

        //////////////////// IMPLEMENTATION ////////////////////

        function activate() {
        }

        function getAllComments() {
            return $http
                .get(baseUrl)
                .then(function(res) {
                    return res.data;
                });
        }
       
        function getCommentById(id) {
            return $http
                .get(baseUrl + '/' + id)
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
        
        function updateComment(commentId, newComment) {
            return $http
                .put(baseUrl + '/' + commentId, newComment)
                .then(function(res) {
                    return res.data;
                });
        }
        
    }

}());
