(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .directive('bcBookCard', BookClubBookCard);

    function BookClubBookCard() {
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
