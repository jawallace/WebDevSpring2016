module.exports = function(app, ReadingModel, DiscussionModel) {
    'use strict';

    var utils = require('./util.js')();

    var BASE_URL = '/api/project/reading';
    var READING_ID_URL = BASE_URL + '/:readingId';
    var DISCUSSIONS_URL = READING_ID_URL + '/discussion';
    var DISCUSSION_ID_URL = DISCUSSIONS_URL + '/:discussionId';

    var retrieveReadingMiddleware = getReading;

    app.get(BASE_URL, getAllReadings);
    
    app.get(READING_ID_URL, getReadingById);
    app.put(READING_ID_URL, updateReading);

    app.get(DISCUSSIONS_URL, retrieveReadingMiddleware, getDiscussionsForReading);
    app.post(DISCUSSIONS_URL, retrieveReadingMiddleware, createDiscussion);
   
    app.get(DISCUSSION_ID_URL, retrieveReadingMiddleware, getDiscussionById);
    app.delete(DISCUSSION_ID_URL, retrieveReadingMiddleware, deleteDiscussion);
    app.put(DISCUSSION_ID_URL, retrieveReadingMiddleware, updateDiscussion);

    //////////////////////////////////////////
    
    var READING_ERR = 'Reading not found.';
    var DISCUSSION_ERR = 'Discussion not found.';
    
    function getAllReadings(req, res) {
        res.json(ReadingModel.findAll());
    }

    function getReadingById(req, res) {
        utils.sendOr404(ReadingModel.findById(req.params.readingId), res, READING_ERR);
    }

    function updateReading(req, res) {
        utils.sendOr404(ReadingModel.update(req.params.readingId, req.body), res, READING_ERR);
    }

    function getDiscussionsForReading(req, res) {
        var discussions = req.reading.discussions.map(function(id) {
            return DiscussionModel.findById(id);
        });

        if (discussions.some(function(d) { return !d; })) {
            res.status(404).send('DISCUSSION IN READING NOT FOUND. INVALID SERVER STATE!');    
        } else {
            res.json(discussions);
        }
    }

    function createDiscussion(req, res) {
        var discussion = DiscussionModel.create(req.body);
    
        utils.sendOr404(ReadingModel.addDiscussion(discussion.id), res, DISCUSSION_ERR);
    }

    function getDiscussionById(req, res) {
        utils.sendOr404(DiscussionModel.findById(req.params.discussionId), res, DISCUSSION_ERR);
    }

    function deleteDiscussion(req, res) {
        var discussion = DiscussionModel.delete(req.params.discussionId);

        utils.sendOr404(ReadingModel.removeDiscussion(req.reading.id, discussion.id), res, DISCUSSION_ERR);
    }

    function updateDiscussion(req, res) {
        utils.sendOr404(DiscussionModel.update(req.params.discussionId, req.body), res, DISCUSSION_ERR);
    }

    function getReading(req, res, next) {
        req.reading = ReadingModel.findById(req.params.readingId);
        if (! req.reading) {
            res.status(404).send(READING_ERR); 
        } else {
            next();
        }
    }
}
