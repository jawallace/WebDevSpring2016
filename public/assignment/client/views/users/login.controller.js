(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = [ 'UserService', '$rootScope', '$state' ];

    function LoginController(UserService, $rootScope, $state) {
        var vm = this;
       
        vm.msg = '';
        vm.user = {}; // ng-model
        vm.login = login;

        function login(user) {
            UserService
                .findByUsernameAndPassword(user.username, user.password)
                .then(function(foundUser) {
                    if (foundUser) {
                        $rootScope.user = foundUser;
                        $state.go('profile');
                        vm.msg = '';
                    }
                }, function(err) {
                    vm.msg = 'Username and Password combination not found.';    
                });
        }
    }

}());
