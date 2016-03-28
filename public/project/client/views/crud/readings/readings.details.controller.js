(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('ReadingDetailsController', ReadingDetailsController);

    ReadingDetailsController.$inject = [ 'ReadingService', 'DiscussionService', 'BookService', '$stateParams', 'UserService' ];
    function ReadingDetailsController(ReadingService, DiscussionService, BookService, $stateParams, UserService) {
        var vm = this;

        var theReading;
        var id = $stateParams.id;
        vm.book = emptyBook();
        vm.startDate = undefined;
        vm.endDate = undefined;
        vm.discussions = [];
        vm.users = [];

        vm.topic;
        vm.user;
        vm.addDiscussion = addDiscussion;
        vm.removeDiscussion = removeDiscussion;

        activate();

        function activate() {
            ReadingService
                .getReadingById(id)
                .then(function(reading) {
                    setReading(reading);
                });

            UserService
                .findAllUsers()
                .then(function(users) {
                    vm.users = users;
                });
        }

        function addDiscussion() {
            ReadingService
                .addDiscussionToReading(id, { topic: vm.topic, user: vm.user.id, comments: [] })
                .then(function(reading) {
                    setReading(reading);
                    vm.topic = undefined;
                    vm.user = undefined;
                });
        }

        function removeDiscussion(discussion) {
            ReadingService
                .removeDiscussionFromReading(theReading.id, discussion.id)
                .then(function(reading) {
                    setReading(reading);
                });
        }

        function setReading(reading) {
            theReading = reading;

            vm.startDate = theReading.startDate;
            vm.endDate = theReading.endDate;

            BookService
                .getBookById(reading.book)
                .then(function(res) {
                    vm.book = res.data;
                })
            ;

            ReadingService
                .getDiscussionsForReading(reading.id)
                .then(function(discussions) {
                    vm.discussions = discussions;
                });
        }

        function emptyBook() {
            return {
                title: undefined,
                cover: {
                    thumb: undefined
                }
            };
        }
    }
}());
