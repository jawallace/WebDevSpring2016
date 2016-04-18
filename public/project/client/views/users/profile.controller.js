(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = [ 'UserService', '$stateParams' ];
    function ProfileController(UserService, $stateParams) {
        var vm = this;

        var userId = $stateParams.userId;

        vm.user;
        vm.isLoggedInUser;
        vm.password;
        vm.verifyPassword;

        vm.updateUser = updateUser;

        activate();

        //////////////////////////////////////////
        
        function activate() {
            UserService
                .findUserById(userId)
                .then(function(user) {
                    UserService
                        .getGroupsForUser(userId)
                        .then(function(groups) {
                            user.groupInfo = groups;
                            vm.user = user;
                        });
                });
            
            UserService
                .isLoggedIn()
                .then(function(user) {
                    vm.isLoggedInUser = user._id === userId;
                });
        }

        function updateUser() {
            var user = angular.copy(vm.user);
            user.password = vm.password;
            user.groupInfo = undefined;

            UserService
                .updateUser(user._id, user)
                .then(function() {
                    activate();
                    vm.password = undefined;
                    vm.verifyPassword = undefined;
                });
        }

    }

}());
