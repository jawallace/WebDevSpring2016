(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = [ '$rootScope', 'UserService' ];

    function ProfileController($rootScope, UserService) {
        var vm = this;
       
        var loggedInUser = $rootScope.user || {};

        vm.user = {
            username: loggedInUser.username,
            password: loggedInUser.password,
            firstName: loggedInUser.firstName,
            lastName: loggedInUser.lastName,
            email: loggedInUser.email
        };

        vm.update = update;

        function update(user) {
            UserService
                .updateUser(loggedInUser['_id'], user)
                .then(function(updatedUser) {
                    $rootScope.user = updatedUser;
                });
        }
    }

}());
