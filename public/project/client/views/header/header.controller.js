(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = [ '$rootScope', '$state', 'UserService' ];
    function HeaderController($rootScope, $state, UserService) {
        var vm = this;
      
        vm.logout = logout;

        activate();

        //////////////////////////////////////
        
        function activate() {
            UserService
                .isLoggedIn()
                .then(function(user) {
                    $rootScope.user = user;
                });
        }

        function logout() {
            UserService
                .logout()
                .then(function() {
                    $rootScope.user = undefined; 
                    $state.go('home');
                });
        }
    }

}());
