module.exports = function(app, DiscussionModel, security) {
    'use strict';

    var utils = require('../utils/util.js')();

    var BASE_URL = '/api/project/group/:groupId/reading/:readingId/discussion';
    var DISCUSSION_ID_URL = BASE_URL + '/:discussionId';

    var DISCUSSION_ERR = 'Discussion not found.';

    app.get(    BASE_URL,                                                           getDiscussionsForReading);
    app.post(   BASE_URL,           security.auth, security.isGroupMember,          createDiscussion);
    
    app.get(    DISCUSSION_ID_URL,                                                  getDiscussionById);
    app.put(    DISCUSSION_ID_URL,  security.auth, security.canManageDiscussion,    updateDiscussion);
    app.delete( DISCUSSION_ID_URL,  security.auth, security.canManageDiscussion,    deleteDiscussion);

    //////////////////////////////////////////////
   
    function getDiscussionsForReading(req, res) {
        DiscussionModel
            .findForReading(req.target.reading._id)
            .then(function(discussions) {
                utils.sendOr404(discussions, res, DISCUSSION_ERR);
            })
            .catch(function(err) {
               res.status(500).send(err);
            });
    }

    function createDiscussion(req, res) {
        var discussion = req.body;
        discussion.reading = req.target.reading._id;

        DiscussionModel
            .create(discussion)
            .then(function(discussion) {
                utils.sendOr404(discussion, res, DISCUSSION_ERR);
            })
            .catch(function(err) {
                res.status(500).send(err);
            });
    }

    function getDiscussionById(req, res) {
        res.json(req.target.discussion);
    }

    function updateDiscussion(req, res) {
        DiscussionModel
            .update(req.target.discussion._id, req.body)
            .then(function(discussion) {
                res.json(discussion);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function deleteDiscussion(req, res) {
        DiscussionModel
            .delete(req.target.discussion._id)
            .then(function(discussions) {
                res.json(discussions);
            })
            .catch(function(err) {
                res.status(500).send(err);
            });
    }

}
