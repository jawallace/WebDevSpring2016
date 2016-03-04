(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .factory('CommentService', CommentService);

    /**
     * Comment: {
     *      id: id, id of the comment
     *      user: integer, id of the user
     *      text: string, comment text
     *      parentComment: integer, id of parent comment (optional)
     * }
     *
     */
    function CommentService() {

        //////////////////// API DECLARATION ////////////////////
        var comments = [];

        var service = {
            comments: comments,
            createComment: createComment,
            getAllComments: getAllComments,
            getCommentById: getCommentById,
            getCommentsForUser: getCommentsForUser,
            deleteComment: deleteComment,
            updateComment: updateComment
        };

        activate();

        return service;

        //////////////////// IMPLEMENTATION ////////////////////

        function activate() {
            comments.push({
                id: 0,
                user: 123,
                text: 'This is an example comment'
            });

            comments.push({
                id: 1,
                user: 234,
                text: 'This is an example reply to a comment',
                parentComment: 0
            });
            
            comments.push({
                id: 2,
                user: 345,
                text: 'This is an example reply to a reply to a comment',
                parentComment: 1
            });
            
            comments.push({
                id: 3,
                user: 567,
                text: 'This is just another comment'
            });
            
            comments.push({
                id: 4,
                user: 456,
                text: 'This is just another comment too'
            });
        }

        function createComment(comment, callback) {
            comment.id = new Date().getTime();
            comments.push(comment);

            callback(comment);
        }

        function getAllComments(callback) {
            callback(comments); 
        }
       
        function getCommentById(id, callback) {
            var length = this.comments.length;
            for (var i = 0; i < length; i++) {
                var theComment = this.comments[i];
                
                if (theComment.id === id) {
                    callback(theComment);
                    return;
                }
            }

            callback(null);
        }

        function getCommentsForUser(userId, callback) {
            var results = [];

            var length = this.comments.length;
            for (var i = 0; i < length; i++) {
                var theComment = this.comments[i];
                
                if (theComment.user === userId) {
                    results.push(theComment);
                }
            }

            callback(results);
        }
        
        function deleteComment(commentId, callback) {
            var length = this.comments.length;
            
            var index;
            for (var i = 0; i < length; i++) {
                var theComment = this.comments[i];
                
                if (theComment.id === commentId) {
                    index = i;
                    break;
                }
            }

            if (index !== undefined) {
                this.comments.splice(index, 1);
            }

            callback(this.comments);
        }

        function updateComment(commentId, newComment, callback) {
            var length = this.comments.length;
            
            var theComment;
            for (var i = 0; i < length; i++) {
                theComment = this.comments[i];
                
                if (theComment.id === commentId) {
                    theComment.text = newComment.text;
                    theComment.user = newComment.user;
                    theComment.parentComment = newComment.parentComment;
                    break;
                }
            }

            callback(theComment);
        }

    }

}());
