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

        function select() {
            console.log('select');
        }
    }

}());
