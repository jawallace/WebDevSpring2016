(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = [ 'UserService', '$rootScope', '$state' ]
    function RegisterController(UserService, $rootScope, $state) {
        var vm = this;

        // ng-model
        vm.user = {
            fname: '',
            lname: '',
            username: '',
            password: ''
        };
        
        // ng-model 
        vm.verifyPassword; 
        
        // ng-model
        vm.validation = {};

        vm.register = register;

        function register() {
            if (! validate()) {
                return;
            } 
            
            vm.validation = {};
            UserService
                .createUser(vm.user)
                .then(function(user) {
                    $rootScope.user = user;
                    $state.go('home');
                }, function(err) {
                    console.log(err);  
                });
        }

        function validate() {
            var result = true;
            vm.validation = {};
            if (! vm.user.fname) {
                vm.validation.fname = 'This field cannot be empty';
                result = false;
            }
            
            if (! vm.user.lname) {
                vm.validation.lname = 'This field cannot be empty';
                result = false;
            }
            
            if (! vm.user.username) {
                vm.validation.username = 'This field cannot be empty';
                result = false;
            }
            
            if (vm.user.password !== vm.verifyPassword) {
                vm.validation.password = 'Passwords must match';
                result = false;
            }

            if (! vm.user.password || ! vm.verifyPassword) {
                vm.validation.password = 'This field cannot be empty';
                result = false;
            }
            
            return result;
        }
    }
}());
