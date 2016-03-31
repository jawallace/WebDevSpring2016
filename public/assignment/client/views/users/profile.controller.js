(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = [ '$rootScope', 'UserService', '$scope' ];

    function ProfileController($rootScope, UserService) {
        var vm = this;
       
        var loggedInUser;
        vm.user;

        activate($rootScope.user);

        //////////////////////////////

        function activate(u) {
            loggedInUser = u || {};
            vm.user = {
                username: loggedInUser.username,
                password: loggedInUser.password,
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email
            };
        }

        vm.update = update;

        function update(user) {
            UserService
                .updateUser(loggedInUser['_id'], user)
                .then(function(updatedUser) {
                    $rootScope.user = updatedUser;
                    
                    activate(updatedUser);
                });
        }
    }

}());
