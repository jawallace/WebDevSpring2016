(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('MainController', MainController);

    MainController.$inject = [ '$scope', '$state', '$rootScope' ];
    function MainController($scope, $state, $rootScope) {
        onLandingPage();

        $scope.$watch('user', onLandingPage);
        $rootScope.$on('$stateChangeStart', function(event, toState) {
            if (toState.name !== 'home') {
                $rootScope.isLandingPage = false;
            } else {
                $rootScope.isLandingPage = !$rootScope.user;
            }
        });

        ////////////////////////////////////
        
        function onLandingPage() {
            var result = !$scope.user && ($state.is('home') || $state.$current.self.name === '');
            $rootScope.isLandingPage = result;
        }
    }
}());
