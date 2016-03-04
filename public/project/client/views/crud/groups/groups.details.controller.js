(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('GroupDetailsController', GroupDetailsController);

    GroupDetailsController.$inject = [ 'GroupService', 'UserService', '$stateParams' ]
    function GroupDetailsController(GroupService, UserService, $stateParams) {
        var vm = this;

        vm.name = undefined;
        vm.readings = [];
        vm.admins = [];
        vm.members = [];

        activate();

        function activate() {
            var id = parseInt($stateParams.id);
            GroupService.getGroupById(id, function(group) {
                vm.name = group.name;
                
                vm.readings = group.readings;

                getAdmins(group.admins);

                getMembers(group.members);
            });
        }

        function getAdmins(admins) {
            for (var i = 0; i < admins.length; i++) {
                UserService.findUserById(admins[i], function(user) {
                    vm.admins.push(user);
                });
            }
        }

        function getMembers(members) {
            for (var i = 0; i < members.length; i++) {
                UserService.findUserById(members[i], function(user) {
                    vm.members.push(user);
                });
            }
        }
    }

}());
