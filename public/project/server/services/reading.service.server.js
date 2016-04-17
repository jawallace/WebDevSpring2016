module.exports = function(app, ReadingModel, security) {
    'use strict';

    var utils = require('../utils/util.js')();
    
    var BASE_URL = '/api/project/group/:groupId/reading';
    var READING_ID_URL = BASE_URL + '/:readingId';
    
    app.get(    BASE_URL,                                           getReadingsForGroup);
    app.post(   BASE_URL,           security.auth, security.admin,  addReading);

    app.get(    READING_ID_URL,                                     getReadingById);
    app.put(    READING_ID_URL,     security.auth, security.admin,  updateReading);
    app.delete( READING_ID_URL,     security.auth, security.admin,  deleteReading);

    //////////////////////////////////////////
    
    function getReadingsForGroup(req, res) {
        ReadingModel
            .findByGroup(req.target.group._id)
            .then(function(readings) {
                res.json(readings);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function addReading(req, res) {
        var reading = req.body;
        reading.group = req.target.group._id;

        ReadingModel
            .create(reading)
            .then(function(reading) {
                res.json(reading);
            })
            .catch(function(err) {
                res.status(400).json(err);
            });
    }
    
    function getReadingById(req, res) {
        res.json(req.target.reading);
    }

    function updateReading(req, res) {
        ReadingModel
            .update(req.target.reading._id, req.body)
            .then(function(reading) {
                res.json(reading); 
            })
            .catch(function(err) {
                res.status(500).send(err);   
            });
    }
    
    function deleteReading(req, res) {
        ReadingModel
            .delete(req.target.reading._id)
            .then(function(readings) {
                res.json(readings);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

}
