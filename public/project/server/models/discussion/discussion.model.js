module.exports = function(mongoose) {
    'use strict';

    var utils = require('../../utils/util.js')();
    var DiscussionModel = require('./discussion.schema.js')(mongoose);

    var service = utils.deferService({
        findById: getDiscussionById,
        findAll: getAllDiscussions,
        findByReading: getDiscussionsForReading,
        findByUser: getDiscussionsForUser,
        create: createDiscussion,
        update: updateDiscussion,
        delete: deleteDiscussion
    });

    return service;

    //////////////////////////////////
    
    function createDiscussion(resolve, reject, discussion) {
        DiscussionModel.create(discussion, function(err, discussion) {
            return err ? reject(err) : resolve(discussion);
        });
    }

    function getDiscussionById(resolve, reject, id) {
        DiscussionModel.findById(id, function(err, discussion) {
            return err ? reject(err) : resolve(discussion);
        });
    }

    function getAllDiscussions() {
        DiscussionModel.find(function(err, discussions) {
            return err ? reject(err) : resolve(discussions);
        });
    }

    function updateDiscussion(resolve, reject, id, updatedDiscussion) {
        DiscussionModel.findById(id, function(err, discussion) {
            if (err) {
                return reject(err);
            }

            utils.extend(discussion, updatedDiscussion);

            discussion.save(function(err) {
                return err ? reject(err) : resolve(discussion);
            });
        });
    }

    function deleteDiscussion(resolve, reject, id) {
        DiscussionModel.findById(id).remove(function(err) {
            if (err) {
                return reject(err);
            }

            DiscussionModel.find(function(err, discussions) {
                return err ? reject(err) : resolve(discussions);
            });
        });
    }

    function getDiscussionsForReading(resolve, reject, readingId) {
        DiscussionModel.find({ reading: readingId }, null, { sort: 'posted' }, function(err, discussions) {
            return err ? reject(err) : resolve(discussions);
        });
    }
    
    function getDiscussionsForUser(resolve, reject, userId) {
        DiscussionModel.find({ user: userId }, null, { sort: 'posted' }, function(err, discussions) {
            return err ? reject(err) : resolve(discussions);
        });
    }
}

