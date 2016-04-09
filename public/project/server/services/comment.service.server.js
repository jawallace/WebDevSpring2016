module.exports = function(app, CommentModel) {
    'use strict';

    var utils = require('../utils/util.js')();

    var errorMsg = 'Comment not found.';

    var BASE_URL = '/api/project/comment';
    var COMMENT_ID_URL = '/:slug';
    
    var USER_URL = '/api/project/user/:userId/comment';

    var DISCUSSION_URL = '/api/project/discussion/:discussionId/comment'

    app.get(BASE_URL, getAllComments);
    app.get(BASE_URL + COMMENT_ID_URL, getCommentById);
    app.put(BASE_URL + COMMENT_ID_URL, updateComment);

    app.get(USER_URL, getCommentsForUser);
    app.get(DISCUSSION_URL, getCommentsForDiscussion);

    function getAllComments(req, res) {
        CommentModel
            .findAll()
            .then(function(comments) {
                utils.sendOr404(comments, res, errorMsg); 
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

    function getCommentById(req, res) {
        CommentModel
            .findById(req.params.commentId)
            .then(function(comment) {
                utils.sendOr404(comment, res, errorMsg); 
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

    function updateComment(req, res) {
        CommentModel
            .update(req.params.commentId, req.body)
            .then(function(comment) {
                utils.sendOr404(comment, res, errorMsg); 
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

    function getCommentsForUser(req, res) {
        CommentModel
            .findByUser(req.params.userId)
            .then(function(comment) {
                utils.sendOr404(comment, res, errorMsg); 
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

    function getCommentsForDiscussion(req, res) {
        CommentModel
            .findByDiscussion(req.params.discussionId)
            .then(function(comments) {
                utils.sendOr404(comments, res, errorMsg); 
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

};
