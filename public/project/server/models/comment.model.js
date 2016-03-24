/**
 * Comment: {
 *      id: id, id of the comment
 *      user: integer, id of the user
 *      text: string, comment text
 *      parentComment: integer, id of parent comment (optional)
 * }
 *
 */
module.exports = function() {
    'use strict';

    var utils = require('./util.js')();

    var comments = [];

    var service = {
        comments: comments,
        create: createComment,
        findAll: getAllComments,
        findById: getCommentById,
        findByUser: getCommentsForUser,
        delete: deleteComment,
        update: updateComment
    };

    activate();

    return service;

    //////////////////// IMPLEMENTATION ////////////////////

    function activate() {
        var mockData = require('./comment.mock.json');

        for (var i = 0; i < mockData.length; i++) {
            comments.push(mockData[i]);
        }
    }

    function createComment(comment) {
        comment.id = utils.guid();
        comments.push(comment);

        return comment;
    }

    function getAllComments() {
        return comments;
    }
   
    function getCommentById(id) {
        var comment = utils.findById(comments, id);

        if (comment) {
            return comment.value;
        }
    }

    function getCommentsForUser(userId) {
        return comments.filter(function(comment) {
            comment.userId === userId;
        });
    }
    
    function deleteComment(commentId) {
        var comment = utils.findById(comments, commentId);

        if (comment) {
            this.comments.splice(comment.index, 1);
        }
        
        return comment.value;
    }

    function updateComment(commentId, newComment, callback) {
        var comment = utils.findById(comments, commentId);

        if (comment) {
            utils.extend(comment.value, newComment);
            return comment.value;
        }
    }
};
