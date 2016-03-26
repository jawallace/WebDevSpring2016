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
            GroupService
                .getGroupById(id)
                .then(function(group) {
                    vm.name = group.name;
                    
                    vm.readings = group.readings;
                });

            GroupService
                .getAdminsForGroup(id)
                .then(function(admins) {
                    vm.admins = admins;
                });
            
            GroupService
                .getMembersForGroup(id)
                .then(function(members) {
                    vm.members = members;
                });
        }
    }

}());
