(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = [ '$rootScope', '$state', 'UserService' ];

    function RegisterController($rootScope, $state, UserService) {
        var vm = this;
        
        vm.user = {}; // represents the user object
        
        vm.register = register;
       
        function register(newUser) {
            UserService
                .createUser(newUser)
                .then(function(user) {
                    $rootScope.user = user;

                    $state.go('profile');
                });
        }

    }

}());
