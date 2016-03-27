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
        vm.users = [];

        vm.startDate;
        vm.endDate;
        vm.book;
        vm.newUser;
        vm.newUserAdmin;

        vm.addReading = addReading;
        vm.addUser = addUser;

        var id = $stateParams.id;

        activate();

        ///////////////////////////////////

        function activate() {
            UserService
                .findAllUsers()
                .then(function(users) {
                    vm.users = users;
                });

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

        function addReading() {
            var reading = {
                startDate: vm.startDate,
                endDate: vm.endDate,
                book: vm.book
            };

            GroupService
                .addReadingToGroup(id, reading)
                .then(function() {
                    activate();

                    vm.startDate = undefined;
                    vm.endDate = undefined;
                    vm.book = undefined;
                }, function(err) {
                    console.log(err);           
                });
        }

        function addUser() {
            if (vm.newUserAdmin) {
                GroupService
                    .addAdminToGroup(id, vm.newUser.id)
                    .then(function(g) {
                        activate();
                        vm.newUser = undefined;
                        vm.newUserAdmin = false;
                    });
            } else {
                GroupService
                    .addMemberToGroup(id, vm.newUser.id)
                    .then(function(g) {
                        activate();
                        vm.newUser = undefined;
                        vm.newUserAdmin = false;
                    });
            }
        }
    }

}());
