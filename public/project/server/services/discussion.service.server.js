module.exports = function(app, DiscussionModel, CommentModel) {
    'use strict';

    var utils = require('../utils/util.js')();

    var BASE_URL = '/api/project/discussion';
    var DISCUSSION_ID_URL = BASE_URL + '/:discussionId';
    var COMMENT_URL =  DISCUSSION_ID_URL + '/comment';
    var COMMENT_ID_URL = COMMENT_URL + '/:commentId';

    var DISCUSSION_ERR = 'Discussion not found.';
    var COMMENT_ERR = 'Comment not found.';

    var discussionMiddleware = discussionMiddleware;

    app.get(BASE_URL, getAllDiscussions);

    app.get(DISCUSSION_ID_URL, discussionMiddleware, getDiscussionById);
    app.put(DISCUSSION_ID_URL, discussionMiddleware, updateDiscussion);

    app.get(COMMENT_ID_URL, discussionMiddleware, getComment);
    app.put(COMMENT_ID_URL, discussionMiddleware, updateComment);
    app.delete(COMMENT_ID_URL, discussionMiddleware, deleteComment);
    
    app.post(COMMENT_URL, discussionMiddleware, createComment);
    app.get(COMMENT_URL, discussionMiddleware, getCommentsForDiscussion);

    function getAllDiscussions(req, res) {
        DiscussionModel
            .findAll()
            .then(function(discussions) {
                utils.sendOr404(discussions, res, DISCUSSION_ERR);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

    function getDiscussionById(req, res) {
        res.json(req.discussion);
    }

    function updateDiscussion(req, res) {
        DiscussionModel
            .update(req.discussion._id, req.body)
            .then(function(discussion) {
                res.json(discussion);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

    function getComment(req, res) {
        CommentModel
            .findById(req.params.commentId)
            .then(function(comment) {
                utils.sendOr404(comment, res, COMMENT_ERR); 
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

    function updateComment(req, res) {
        CommentModel
            .update(req.params.commentId, req.body)
            .then(function(comment) {
                utils.sendOr404(comment, res, COMMENT_ERR); 
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

    function createComment(req, res) {
        var comment = req.body;
        comment.discussion = req.discussion.id;

        CommentModel
            .create(comment)
            .then(function(comment) {
                utils.sendOr404(comment, res, COMMENT_ERR);
            })
            .catch(function(err) {
                res.status(500).send(err);
            });
    }

    function deleteComment(req, res) {
        CommentModel
            .delete(req.params.commentId)
            .then(function(comments) {
                utils.sendOr404(comments, res, COMMENT_ERR);
            })
            .catch(function(err) {
                res.status(500).send(err);
            });
    }

    function getCommentsForDiscussion(req, res) {
        CommentModel
            .findByDiscussion(req.discussion._id)
            .then(function(comments) {
                utils.sendOr404(comments, res, COMMENT_ERR);
            })
            .catch(function(err) {
                res.status(500).send(err);
            });
    }

    function discussionMiddleware(req, res, next) {
        DiscussionModel
            .findById(req.params.discussionId)
            .then(function(discussion) {
                if (discussion) {
                    req.discussion = discussion;
                    next();
                } else {
                    res.status(404).send(DISCUSSION_ERR);
                }
            })
            .catch(function(err) {
                res.status(500).json(err);   
            });
    }
}
