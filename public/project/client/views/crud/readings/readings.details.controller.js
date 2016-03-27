(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('ReadingDetailsController', ReadingDetailsController);

    ReadingDetailsController.$inject = [ 'ReadingService', 'DiscussionService', 'BookService', '$stateParams' ];
    function ReadingDetailsController(ReadingService, DiscussionService, BookService, $stateParams) {
        var vm = this;

        var theReading;
        var id = stateParams.id;
        vm.book = emptyBook();
        vm.startDate = undefined;
        vm.endDate = undefined;
        vm.discussions = [];

        vm.removeDiscussion = removeDiscussion;

        activate();

        function activate() {

            ReadingService
                .getReadingById(id)
                .then(function(reading) {
                    setReading(reading);
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
