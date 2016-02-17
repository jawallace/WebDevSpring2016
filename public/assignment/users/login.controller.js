(function() {
    'use strict';

    angular.module('FormBuilderApp')
           .controller('LoginController', LoginController);

    LoginController.$inject = [ 'UserService', '$rootScope', '$state' ];

    function LoginController(UserService, $rootScope, $state) {
        var vm = this;
        
        vm.user = {}; // ng-model
        vm.login = login;

        function login(user) {
            UserService.findByUsernameAndPassword(user.username, user.password, function (foundUser) {
                if (foundUser) {
                    $rootScope.user = foundUser;
                    $state.go('profile');
                }
            });
        }
    }

}());
