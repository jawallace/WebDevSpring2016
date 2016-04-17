module.exports = function(mongoose) {
    'use strict';

    var utils = require('../../utils/util.js')();
    var model = require('./comment.schema.js')(mongoose);

    var service = utils.deferService({
        create: createComment,
        findAll: getAllComments,
        findById: getCommentById,
        findByUser: getCommentsForUser,
        findByDiscussion: findCommentsForDiscussion,
        delete: deleteComment,
        update: updateComment
    });

    return service;

    //////////////////// IMPLEMENTATION ////////////////////

    function createComment(resolve, reject, comment) {
        model.create(comment, function(err, comment) {
            return err ? reject(err) : resolve(comment);     
        });
    }

    function getAllComments(resolve, reject) {
        model.find(function(err, comments) {
            return err ? reject(err) : resolve(comments);
        });
    }
   
    function getCommentById(resolve, reject, id) {
        model.findById(id, function(err, comment) {
            return err ? reject(err) : resolve(comment);
        });
    }

    function getCommentsForUser(resolve, reject, userId) {
        model.find({ user: userId }, function(err, comments) {
            return err ? reject(err) : resolve(comments);
        });
    }
   
    function deleteComment(resolve, reject, commentId) {
        model.findById(commentId).remove(function(err) {
            if (err) {
                return reject(err);
            }

            model.find(function(err, comments) {
                return err ? reject(err) : resolve(comments);
            });
        });
    }

    function updateComment(resolve, reject, commentId, newComment) {
        model.findById(commentId, function(err, comment) {
            if (err) {
                return reject(err);
            }

            utils.extend(comment, newComment);

            comment.save(function(err) {
                return err ? reject(err) : resolve(comment);
            });
        });
    }

    function findCommentsForDiscussion(resolve, reject, discussionId) {
        model.find({ discussion: discussionId }, null, { sort: 'posted' }, function(err, comments) {
            return err ? reject(err) : resolve(comments);
        });
    }
};
