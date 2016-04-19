(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = [ 'UserService', '$stateParams', 'user' ];
    function ProfileController(UserService, $stateParams, loggedInUser) {
        var vm = this;

        var userId = $stateParams.userId;

        vm.user;
        vm.isLoggedInUser;
        vm.password;
        vm.verifyPassword;

        vm.updateUser = updateUser;
        vm.leaveGroup = leaveGroup;

        activate();

        //////////////////////////////////////////
        
        function activate() {
            UserService
                .findUserById(userId)
                .then(function(user) {
                    UserService
                        .getGroupsForUser(userId)
                        .then(function(groups) {
                            groups.admin.forEach(function(g) {
                                g.admin = true; 
                            });
                            
                            groups.member.forEach(function(g) {
                                g.admin = false; 
                            });

                            user.groupInfo = [].concat(groups.admin).concat(groups.member);
                            vm.user = user;
                            vm.isLoggedInUser = loggedInUser._id === userId;
                        });
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

        function leaveGroup(group) {
            var loc = { group: group._id };
            if (group.admin) {
                GroupService
                    .removeAdminFromGroup(loc, loggedInUser._id)
                    .then(function() {
                        activate();
                    })
                    .catch(function(err) {
                        //TODO
                        console.log(err);
                    });
            } else {
                GroupService
                    .removeMemberFromGroup(loc, loggedInUser._id)
                    .then(function() {
                        activate();
                    })
                    .catch(function(err) {
                        //TODO
                        console.log(err);
                    });
            }
        }
    }

}());
