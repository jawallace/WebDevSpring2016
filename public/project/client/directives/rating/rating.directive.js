(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .directive('bcRating', BookClubRating);

    function BookClubRating() {
        return {
            restrict: 'EA',
            scope: {
                bcValue: '=',
                bcOutOf: '=',
                bcNumRatings: '='
            },
            replace: true,
            controller: 'RatingController',
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'directives/rating/rating.view.html'
        };
    }

}());
