(function() {
    'use strict';

    angular.module('FormBuilderApp')
           .controller('SidebarController', SidebarController);

    SidebarController.$inject = [ '$rootScope' ];

    function SidebarController($rootScope) {
        var vm = this;
        
        vm.isLoggedIn = false;
        vm.isAdmin = false;

        $rootScope.$watch(function() {
            return $rootScope.user;
        }, updateLoggedInStatus);

        function updateLoggedInStatus(newValue, oldValue) {
            vm.isLoggedIn = !!newValue;
            vm.isAdmin = newValue && newValue.role === "admin";
        }
    }

}());
