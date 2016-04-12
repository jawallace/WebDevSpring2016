module.exports = function(app, ReadingModel, DiscussionModel) {
    'use strict';

    var utils = require('../utils/util.js')();
    
    var BASE_URL = '/api/project/reading';
    var READING_ID_URL = BASE_URL + '/:readingId';
    var DISCUSSIONS_URL = READING_ID_URL + '/discussion';
    var DISCUSSION_ID_URL = DISCUSSIONS_URL + '/:discussionId';

    var retrieveReadingMiddleware = getReading;

    app.get(BASE_URL, getAllReadings);
    
    app.get(READING_ID_URL, retrieveReadingMiddleware, getReadingById);
    app.put(READING_ID_URL, retrieveReadingMiddleware, updateReading);

    app.get(DISCUSSIONS_URL, retrieveReadingMiddleware, getDiscussionsForReading);
    app.post(DISCUSSIONS_URL, retrieveReadingMiddleware, createDiscussion);
   
    app.get(DISCUSSION_ID_URL, retrieveReadingMiddleware, getDiscussionById);
    app.delete(DISCUSSION_ID_URL, retrieveReadingMiddleware, deleteDiscussion);
    app.put(DISCUSSION_ID_URL, retrieveReadingMiddleware, updateDiscussion);

    //////////////////////////////////////////
    
    var READING_ERR = 'Reading not found.';
    var DISCUSSION_ERR = 'Discussion not found.';
    
    function getAllReadings(req, res) {
        ReadingModel
            .findAll()
            .then(function(readings) {
                utils.sendOr404(readings, res, READING_ERR);
            })
            .catch(function(err) {
                res.status(500).send(err);   
            });
    }

    function getReadingById(req, res) {
        res.json(req.reading);
    }

    function updateReading(req, res) {
        ReadingModel
            .update(req.reading._id, req.body)
            .then(function(reading) {
                res.json(reading); 
            })
            .catch(function(err) {
                res.status(500).send(err);   
            });
    }

    function getDiscussionsForReading(req, res) {
        DiscussionModel
            .findForReading(req.reading._id)
            .then(function(discussions) {
                utils.sendOr404(discussions, res, DISCUSSION_ERR);
            })
            .catch(function(err) {
               res.status(500).send(err);
            });
    }

    function createDiscussion(req, res) {
        var discussion = req.body;
        discussion.reading = req.reading._id;

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
        DiscussionModel
            .findById(req.params.discussionId)
            .then(function(discussion) {
                utils.sendOr404(discussion, res, DISCUSSION_ERR);
            })
            .catch(function(err) {
                res.status(500).send(err);
            });
    }

    function deleteDiscussion(req, res) {
        DiscussionModel
            .delete(req.params.discussionId)
            .then(function(discussions) {
                res.json(discussions);
            })
            .catch(function(err) {
                res.status(500).send(err);
            });
    }

    function updateDiscussion(req, res) {
        DiscussionModel
            .update(req.params.discussionId, req.body)
            .then(function(discussion) {
                utils.sendOr404(discussion, res, DISCUSSION_ERR);
            })
            .catch(function(err) {
                res.json(500).send(err);
            });
    }

    function getReading(req, res, next) {
        ReadingModel
            .findById(req.params.readingId)
            .then(function(reading) {
                if (reading) {
                    req.reading = reading;
                    next();
                } else {
                    res.status(404).send(READING_ERR); 
                }
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
}
