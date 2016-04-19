(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .directive('bcReading', BookClubReading);

    function BookClubReading() {
        return {
            restrict: 'E',
            scope: {
                bcLoc: '=',
                bcReading: '=',
                bcAllowEditing: '='
            },
            controller: 'ReadingController',
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'directives/reading/reading.view.html'
        };
    }
}());
