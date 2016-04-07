(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .directive('bcBookListItem', BookListItem);

    function BookListItem() {
        return {
            restrict: 'E',
            scope: {
                bcBook: '=',
                bcAllowSelection: '=',
                bcOnSelection: '&'
            },
            controller: 'BookController',
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'directives/book/book.view.html'
        };
    }

}());
