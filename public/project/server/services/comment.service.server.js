module.exports = function(app, CommentModel, security) {
    'use strict';

    var utils = require('../utils/util.js')();

    var errorMsg = 'Comment not found.';
    var COMMENT_ERR = 'Comment not found.';

    var BASE_URL = '/api/project/group/:groupId/reading/:readingId/discussion/:discussionId/comment';
    var COMMENT_ID_URL = BASE_URL + '/:commentId';
    var USER_URL = '/api/project/user/:userId/comment';

    app.get(    BASE_URL,                                                       getCommentsForDiscussion);
    app.post(   BASE_URL,           security.auth, security.isGroupMember,      createComment);
    
    app.get(    COMMENT_ID_URL,                                                 getCommentById);
    app.put(    COMMENT_ID_URL,     security.auth, security.canManageComment,   updateComment);
    app.delete( COMMENT_ID_URL,     security.auth, security.canManageComment,   deleteComment);
    
    app.get(USER_URL, getCommentsForUser);
  
    //////////////////////////////////////////////////////////

    function getCommentsForDiscussion(req, res) {
        CommentModel
            .findByDiscussion(req.target.discussion._id)
            .then(function(comments) {
                utils.sendOr404(comments, res, errorMsg); 
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function createComment(req, res) {
        var comment = req.body;
        comment.discussion = req.target.discussion._id;
        comment.user = req.user._id;

        CommentModel
            .create(comment)
            .then(function(comment) {
                utils.sendOr404(comment, res, COMMENT_ERR);
            })
            .catch(function(err) {
                res.status(500).send(err);
            });
    }

    function getCommentById(req, res) {
        res.json(req.target.comment);
    }

    function updateComment(req, res) {
        CommentModel
            .update(req.target.comment._id, req.body)
            .then(function(comment) {
                utils.sendOr404(comment, res, errorMsg); 
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

    function getCommentsForUser(req, res) {
        CommentModel
            .findByUser(req.target.user._id)
            .then(function(comment) {
                utils.sendOr404(comment, res, errorMsg); 
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

    function deleteComment(req, res) {
        CommentModel
            .delete(req.target.comment._id)
            .then(function(comments) {
                utils.sendOr404(comments, res, COMMENT_ERR);
            })
            .catch(function(err) {
                res.status(500).send(err);
            });
    }

};
