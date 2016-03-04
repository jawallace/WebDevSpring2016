(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('ReadingDetailsController', ReadingDetailsController);

    ReadingDetailsController.$inject = [ 'ReadingService', 'DiscussionService', 'BookService', '$stateParams' ];
    function ReadingDetailsController(ReadingService, DiscussionService, BookService, $stateParams) {
        var vm = this;

        var theReading;
        vm.book = emptyBook();
        vm.startDate = undefined;
        vm.endDate = undefined;
        vm.discussions = [];

        vm.removeDiscussion = removeDiscussion;

        activate();

        function activate() {
            var id = parseInt($stateParams.id);

            ReadingService.getReadingById(id, function(reading) {
                setReading(reading);
            });
        }

        function removeDiscussion(discussion) {
            ReadingService.removeDiscussionFromReading(theReading.id, discussion.id, function(reading) {
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

            var discussions = [];
            for (var i = 0; i < reading.discussions.length; i++) {
                DiscussionService.getDiscussionById(reading.discussions[i], function(discussion) {
                    discussions.push(discussion);
                });
            }
            vm.discussions = discussions;
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
