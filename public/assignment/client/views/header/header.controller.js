(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = [ '$rootScope', '$state', 'UserService' ];

    function HeaderController($rootScope, $state, UserService) {
        var vm = this;

        vm.logout = logout;

        // logged in status
        vm.isLoggedIn = false;
        vm.username = "";
        vm.isAdmin = false;

        $rootScope.$watch(function() {
            return $rootScope.user;
        }, updateLoggedInStatus);

        activate();

        /////////////////////////////////////////

        function activate() {
            UserService
                .isLoggedIn()
                .then(function(user) {
                    if (user) {
                        $rootScope.user = user;
                    }
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

        function updateLoggedInStatus(newValue, oldValue) {
            vm.isLoggedIn = !!newValue;
            vm.username = newValue ? newValue.username : "";
            vm.isAdmin = newValue && newValue.roles.indexOf("admin") > -1;
        }
    }

}());
