(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .factory('DiscussionService', DiscussionService);

    function DiscussionService() {
        var discussions = [];

        var service = {
            discussions: discussions,
            getDiscussionById: getDiscussionById,
            getAllDiscussions: getAllDiscussions,
            createDiscussion: createDiscussion,
            updateDiscussion: updateDiscussion,
            deleteDiscussion: deleteDiscussion,
            addCommentToDiscussion: addCommentToDiscussion,
            removeCommentFromDiscussion: removeCommentFromDiscussion
        };

        activate();

        return service;

        function activate() {
            discussions.push({
                id: 0,
                user: 123,
                topic: 'First Discussion',
                comments: [0, 1, 2]
            });

            discussions.push({
                id: 1,
                user: 234,
                topic: 'Second Discussion',
                comments: [3]
            });

            discussions.push({
                id: 2,
                user: 345,
                topic: 'Third Discussion',
                comments: [4]
            });
        }

        function createDiscussion(userId, topic, callback) {
            var discussion = {
                id: new Date().getTime(),
                user: userId,
                topic: topic,
                comments: []
            };

            discussions.push(discussion);

            callback(discussion);
        }

        function getDiscussionById(id, callback) {
            var discussion = findDiscussion(id);

            if (discussion) {
                callback(discussion.discussion);
            } else {
                callback(null);
            }
        }

        function getAllDiscussions(callback) {
            callback(this.discussions);
        }

        function updateDiscussion(id, updatedDiscussion, callback) {
            var discussion = findDiscussion(id);

            if (discussion) {
                discussion.discussion.user = updatedDiscussion.user;
                discussion.discussion.topic = updatedDiscussion.topic;
                discussion.discussion.comments = updatedDiscussion.comments;
                callback(discussion.discussion);
            } else {
                callback(null);
            }
        }

        function deleteDiscussion(id, callback) {
            var discussion = findDiscussion(id);

            if (discussion) {
                this.discussions.splice(discussion.index, 1);
            }

            callback(this.discussions);
        }

        function addCommentToDiscussion(id, commentId, callback) {
            var discussion = findDiscussion(id);
            
            if (discussion) {
                discussion.discussion.comments.push(commentId);
                callback(discussion.discussion);
            } else {
                callback(null);
            }
        }

        function removeCommentFromDiscussion(id, commentId, callback) {
            var discussion = findDiscussion(id);

            if (discussion) {
                var comments = discussion.discussion.comments;
                var index = comments.indexOf(commentId);
                if (index >= 0) {
                    comments.splice(index, 1);
                }

                callback(discussion.discussion);
            } else {
                callback(null);
            }
        }

        function findDiscussion(id) {
            var length = discussions.length;
            for (var i = 0; i < length; i++) {
                var discussion = discussions[i];

                if (discussion.id === id) {
                    return {
                        index: i,
                        discussion: discussion
                    };
                }
            }
           
            return null;
        }
    }

}());
