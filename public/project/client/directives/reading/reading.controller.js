(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('ReadingController', ReadingController);

    ReadingController.$inject = [ 'BookService', 'DiscussionService', '$q' ];
    function ReadingController(BookService, DiscussionService, $q) {
        var vm = this;

        vm.book;
        vm.discussions;
        vm.isEditable = vm.bcIsAdmin;

        activate();

        //////////////////////////////////////

        function activate() {
            BookService
                .findById(reading.book)
                .then(function(book) {
                    vm.book = book;
                })
                .catch(function(err) {
                    console.log(err);
                });

            DiscussionService
                .getDiscussionsForReading(vm.bcLoc) 
                .then(function(discussions) {
                    vm.discussions = discussions;
                })
                .catch(function(err) {
                    console.log(err);
                });
        }
    }
}());
