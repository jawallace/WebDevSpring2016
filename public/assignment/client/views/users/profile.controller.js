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

            console.log('update!', user);
            UserService
                .updateUser(loggedInUser['_id'], user)
                .then(function(updatedUser) {
                    $rootScope.user = updatedUser;
                    
                    activate(updatedUser);
                    console.log('updated!');
                }, function(err) {
                   console.log('error!', err);    
                });
        }

    }

}());
