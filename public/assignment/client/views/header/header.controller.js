(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = [ '$rootScope', '$state' ];

    function HeaderController($rootScope, $state) {
        var vm = this;

        vm.logout = logout;

        // logged in status
        vm.isLoggedIn = false;
        vm.username = "";
        vm.isAdmin = false;

        $rootScope.$watch(function() {
            return $rootScope.user;
        }, updateLoggedInStatus);

        function logout() {
            $rootScope.user = undefined;
            $state.go('home'); 
        }

        function updateLoggedInStatus(newValue, oldValue) {
            vm.isLoggedIn = !!newValue;
            vm.username = newValue ? newValue.username : "";
            vm.isAdmin = newValue && newValue.role === "admin";
        }
    }

}());
