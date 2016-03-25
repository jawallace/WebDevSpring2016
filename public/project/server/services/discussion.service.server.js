module.exports = function(app, DiscussionModel, CommentModel) {
    'use strict';

    var utils = require('./util.js')();

    var baseUrl = '/api/project/discussion';
    var discussionId = baseUrl + '/:discussionId';
    var commentUrl =  discussionId + '/comment';
    var commentId = commentUrl + '/:commentId';

    var DISCUSSION_ERR = 'Discussion not found.';
    var COMMENT_ERR = 'Comment not found.';

    app.get(baseUrl, getAllDiscussions);

    app.get(discussionId, getDiscussionById);
    app.put(discussionId, updateDiscussion);

    app.get(commentId, getComment);
    app.put(commentId, updateComment);
    app.delete(commentId, deleteComment);
    
    app.post(commentUrl, createComment);
    app.get(commentUrl, getCommentsForDiscussion);

    function getAllDiscussions(req, res) {
        res.json(DiscussionModel.findAll());
    }

    function getDiscussionById(req, res) {
        utils.sendOr404(DiscussionModel.findById(req.params.discussionId), res, DISCUSSION_ERR);
    }

    function updateDiscussion(req, res) {
        utils.sendOr404(DiscussionModel.update(req.params.discussionId, req.body), res, DISCUSSION_ERR);
    }

    function getComment(req, res) {
        var discussion = DiscussionModel.findById(req.params.discussionId);
        if (!discussion) {
            res.status(404).json(DISCUSSION_ERR);
        } else {
            utils.sendOr404(CommentModel.findById(req.params.discussionId), res, COMMENT_ERR);
        }
    }

    function updateComment(req, res) {
        var discussion = DiscussionModel.findById(req.params.discussionId);
        if (!discussion) {
            res.status(404).json(DISCUSSION_ERR);
        } else {
            utils.sendOr404(CommentModel.update(req.params.discussionId, req.body), res, COMMENT_ERR);
        }
    }

    function createComment(req, res) {
        var discussion = DiscussionModel.findById(req.params.discussionId);
        if (! discussion) {
            res.status(404).json(DISCUSSION_ERR);
        } else {
            var comment = CommentModel.create(req.body);
            utils.sendOr404(DiscussionModel.addComment(req.params.discussionId, comment.id), res, COMMENT_ERR);
        }
    }

    function deleteComment(req, res) {
        var discussion = DiscussionModel.findById(req.params.discussionId);
        if (! discussion) {
            res.status(404).json(DISCUSSION_ERR);
        } else {
            var comment = CommentModel.delete(req.params.commentId);
            utils.sendOr404(DiscussionModel.removeComment(req.params.discussionId, comment.id), res, COMMENT_ERR);
        }
    }

    function getCommentsForDiscussion(req, res) {
        var discussion = DiscussionModel.findById(req.params.discussionId);
        if (! discussion) {
            res.status(404).json(DISCUSSION_ERR);
        } else {
            var comments = discussion.comments.map(CommentModel.findById);
            if (comments.length && comments.some(function(c) { return !c }).length) {
                res.status(404).json('INVALID SERVER STATE!: Comments for discussion not found');
            } else {
                res.json(comments);
            }
        }
    }
}
