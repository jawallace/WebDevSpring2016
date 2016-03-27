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

        vm.updateDiscussion = updateDiscussion;
        vm.deleteDiscussion = deleteDiscussion;
        vm.selectDiscussion = selectDiscussion;

        activate();

        function activate() {
            UserService
                .findAllUsers()
                .then(function(users) {
                    vm.users = users;
                });
            
            DiscussionService
                .getAllDiscussions()
                .then(function(discussions) {
                    normalize(discussions);     
                });
        }

        function updateDiscussion() {
            var selectedDiscussion = vm.discussions[selectedIndex];

            var updated = {
                user: vm.selected.userDetails.id,
                topic: vm.selected.topic,
                comments: vm.selected.comments,
            };

            DiscussionService
                .updateDiscussion(selectedDiscussion.id, updated)
                .then(function(updatedDiscussion) {
                    updatedDiscussion.userDetails = vm.selected.userDetails;
                    vm.discussions[selectedIndex] = updatedDiscussion;

                    resetSelection();
                });
        }

        function deleteDiscussion(discussion) {
            //deprecated
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

                (function(d) {
                    UserService
                        .findUserById(d.user)
                        .then(function(user) {
                            d.userDetails = user;
                        });
                }(discussion));

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
