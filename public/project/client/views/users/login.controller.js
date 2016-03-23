(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('LoginController', LoginController);

    LoginController.$inject = [ 'UserService', '$rootScope', '$state' ];
    function LoginController(UserService, $rootScope, $state) {
        var vm = this;

        vm.username; // ng-model
        vm.password; // ng-model
        vm.message = '';

        vm.login = login;

        function login() {
            if (! vm.password || ! vm.username) {
                vm.message = 'Please fill in all fields.';
                return;
            }

            UserService
                .findByUsernameAndPassword(vm.username, vm.password)
                .then(function(user) {
                    console.log('Logged in ', user);
                    $rootScope.user = user;
                    vm.message = '';
                    $state.go('home');
                }, function(err) {
                    vm.message = 'Username / Password pair not found.';
                    vm.password = '';
                });
        }
    }

}());
