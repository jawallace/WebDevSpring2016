module.exports = function() {
    'use strict';

    var utils = require('./util.js')();

    var discussions = [];

    var service = {
        discussions: discussions,
        findById: getDiscussionById,
        findAll: getAllDiscussions,
        create: createDiscussion,
        update: updateDiscussion,
        delete: deleteDiscussion,
        addComment: addCommentToDiscussion,
        removeComment: removeCommentFromDiscussion
    };

    activate();

    return service;

    //////////////////////////////////
    
    function activate() {
        var mock = require('./discussion.mock.json');

        for (var i = 0; i < mock.length; i++) {
            discussions.push(mock[i]);
        }
    }

    function createDiscussion(userId, topic) {
        var discussion = {
            id: utils.guid(),
            user: userId,
            topic: topic,
            comments: []
        };

        discussions.push(discussion);
        
        return discussion;
    }

    function getDiscussionById(id) {
        var discussion = utils.findById(discussions, id);

        if (discussion) {
            return discussion.value;
        } 
    }

    function getAllDiscussions() {
        return this.discussions;
    }

    function updateDiscussion(id, updatedDiscussion) {
        var discussion = utils.findById(this.discussions, id);

        if (discussion) {
            utils.extend(discussion.value, updateDiscussion);

            return discussion.value;
        }
    }

    function deleteDiscussion(id) {
        var discussion = utils.findById(this.discussions, id);

        if (discussion) {
            this.discussions.splice(discussion.index, 1);
        }

        return discussion.value;
    }

    function addCommentToDiscussion(id, commentId) {
        var discussion = utils.findById(this.discussions, id);
        
        if (discussion) {
            discussion.value.comments.push(commentId);
            return discussion.value;
        }
    }

    function removeCommentFromDiscussion(id, commentId) {
        var discussion = utils.findById(this.discussions, id);

        if (discussion) {
            var comments = discussion.value.comments;
            var index = comments.indexOf(commentId);
            if (index >= 0) {
                comments.splice(index, 1);
            }

            return discussion.value;
        }
    }

};

