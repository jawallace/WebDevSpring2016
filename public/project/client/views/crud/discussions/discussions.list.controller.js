(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('DiscussionListController', DiscussionListController);

    DiscussionListController.$inject = [ 'UserService', 'DiscussionService' ];

    function DiscussionListController(UserService, DiscussionService) {
        var vm = this;

        var selectedIndex;
        vm.selected = emptySelection();
        vm.discussions = [];
        vm.users = [];

        vm.addDiscussion = addDiscussion;
        vm.updateDiscussion = updateDiscussion;
        vm.deleteDiscussion = deleteDiscussion;
        vm.selectDiscussion = selectDiscussion;

        activate();

        function activate() {
            UserService.findAllUsers(function(users) {
                vm.users = users;
            });
            
            DiscussionService.getAllDiscussions(function(discussions) {
                normalize(discussions);     
            });
        }

        function addDiscussion() {
            var user = vm.selected.userDetails.id;
            var topic = vm.selected.topic;

            DiscussionService.createDiscussion(user, topic, function(newDiscussion) {
                newDiscussion.userDetails = vm.selected.userDetails;
                vm.discussions.push(newDiscussion);

                resetSelection();
            });
        }

        function updateDiscussion() {
            var selectedDiscussion = vm.discussions[selectedIndex];

            var updated = {
                user: vm.selected.userDetails.id,
                topic: vm.selected.topic,
                comments: vm.selected.comments,
            };

            DiscussionService.updateDiscussion(selectedDiscussion.id, updated, function(updatedDiscussion) {
                updatedDiscussion.userDetails = vm.selected.userDetails;
                vm.discussions[selectedIndex] = updatedDiscussion;

                resetSelection();
            });
        }

        function deleteDiscussion(discussion) {
            DiscussionService.deleteDiscussion(discussion.id, function(discussions) {
                normalize(discussions);
            });
        }

        function selectDiscussion(index) {
            selectedIndex = index;
            var selectedDiscussion = vm.discussions[index];

            vm.selected.id = selectedDiscussion.id;
            vm.selected.user = selectedDiscussion.user;
            vm.selected.topic = selectedDiscussion.topic;
            vm.selected.userDetails = selectedDiscussion.userDetails;
            vm.selected.comments = selectedDiscussion.comments;
        }

        function emptySelection() {
            return {
                id: undefined,
                user: null,
                userDetails: {
                    firstName: ''
                },
                topic: ''
            };
        }

        function normalize(discussions) {
            var normalized = [];

            var length = discussions.length;
            for (var i = 0; i < length; i++) {
                var discussion = discussions[i];

                UserService.findUserById(discussion.user, function(user) {
                    discussion.userDetails = user;
                });

                normalized.push(discussion);
            }

            vm.discussions = normalized;
        }

        function resetSelection() {
            selectedIndex = 0;
            vm.selected = emptySelection;
        }
    }
}());
