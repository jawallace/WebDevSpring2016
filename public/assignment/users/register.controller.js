(function() {
    'use strict';

    angular.module('FormBuilderApp')
           .controller('RegisterController', RegisterController);

    function RegisterController($rootScope, $state, UserService) {
        var vm = this;
        
        vm.user = {}; // represents the user object
        
        vm.register = register;
       
        function register(newUser) {
            UserService.createUser(newUser, function(user) {
                $rootScope.user = user;

                $state.go('profile');
            });
        }

    }

}());
