(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('LoginController', LoginController);

    function LoginController() {
        var vm = this;

        vm.username; // ng-model
        vm.password; // ng-model
        vm.message = '';

        vm.login = login;

        function login() {
            console.log('Login!', vm.username, vm.password);
            vm.message = "Hello, World";
        }
    }

}());
