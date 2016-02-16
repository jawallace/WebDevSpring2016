(function() {
    'use strict';

    angular.module('FormBuilderApp')
           .controller('ProfileController', ProfileController);

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
            console.log('update', loggedInUser['_id'], user);
            UserService.updateUser(loggedInUser['_id'], user, function(updatedUser) {
                console.log("User, Updated User", loggedInUser, updatedUser);
            });
        }
    }

}());
