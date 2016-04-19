(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('BookController', BookController);

    BookController.$inject = [ 'BookService' ];
    function BookController(BookService) {
        var vm = this;

        vm.book = {};
        vm.includeFooter = vm.bcAllowSelection;
        vm.select = select;
        vm.showDetails = false;
        vm.detailsIcon = "expand_more";
        vm.toggleDetails = toggleDetails;
        
        activate();

        ////////////////////////////////
        
        function activate() {
            var bookId = vm.bcBook;

            BookService
                .getBookById(bookId)
                .then(function(book) {
                    vm.book = book;
                });
        }

        function toggleDetails() {
            vm.showDetails = !vm.showDetails;
            vm.detailsIcon = vm.showDetails ? "expand_less" : "expand_more";
        }

        function select() {
            var id = vm.book.id;
            vm.bcOnSelection()(id); 
        }
    }

}());
