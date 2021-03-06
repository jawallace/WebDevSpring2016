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
        vm.update = update;
        vm.successMsg;
        vm.failMsg;

        activate($rootScope.user);

        //////////////////////////////

        function activate(u) {
            loggedInUser = u || {};
            vm.user = {
                username: loggedInUser.username,
                password: loggedInUser.password,
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                emails: (loggedInUser.emails || []).join("\n"),
                phones: (loggedInUser.phones || []).join("\n")
            };
        }

        function update(user) {
            user.emails = user.emails.split("\n").map(function(s) { return s.trim(); });
            user.phones = user.phones.split("\n").map(function(s) { return s.trim(); });
            
            vm.successMsg = '';
            vm.failMsg = '';
            UserService
                .updateUser(loggedInUser['_id'], user)
                .then(function(updatedUser) {
                    $rootScope.user = updatedUser;
                    activate(updatedUser);
                    vm.successMsg = 'Updated profile.';
                }, function(err) {
                   console.log('error!', err);    
                   vm.failMsg = 'Failed to update profile. Please try again.';
                });
        }

    }

}());
