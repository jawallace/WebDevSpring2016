(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .directive('bcComment', BookClubComment);

    function BookClubComment() {
        return {
            restrict: 'E',
            scope: {
                bcLoc: '=',
                bcComment: '=',
                bcUser: '=',
                bcIsAdmin: '=',
                bcOnRemove: '&'
            },
            controller: 'CommentController',
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'directives/comment/comment.view.html'
        };
    }

}());
