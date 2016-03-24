module.exports = function(app, CommentModel) {
    'use strict';

    var utils = require('./util.js')();

    var errorMsg = 'Comment not found.';

    var baseUrl = '/api/project/comment';
    var baseUserUrl = '/api/project/user/:userId/comment';
    var commentId = '/:commentId';

    app.get(baseUrl, getAllComments);
    app.get(baseUrl + commentId, getCommentById);
    app.put(baseUrl + commentId, updateComment);

    app.get(baseUserUrl, getCommentsForUser);

    function getAllComments(req, res) {
        res.json(CommentModel.findAll());
    }

    function getCommentById(req, res) {
        utils.sendOr404(CommentModel.findById(req.params.commentId), res, errorMsg);
    }

    function updateComment(req, res) {
        utils.sendOr404(CommentModel.update(req.params.commentId, req.body), res, errorMsg);
    }

    function getCommentsForUser(req, res) {
        utils.sendOr404(CommentModel.findByUser(req.params.userId), res, errorMsg);
    }

};
