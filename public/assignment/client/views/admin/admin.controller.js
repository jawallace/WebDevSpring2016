(function() {
    'use strict';

    angular
        .module('FormBuilderApp')
        .controller('AdminController', AdminController);

    AdminController.$inject = [ 'AdminService' ];
    function AdminController(AdminService) {
        var vm = this;
        
        vm.users;
        vm.predicate;
        vm.reversed = false;
        vm.selected;
        vm.selectedIndex;

        vm.createUser = createUser;
        vm.editUser = editUser;
        vm.deleteUser = deleteUser;
        vm.selectUser = selectUser;
        vm.sort = createSortFunction();

        activate();

        ////////////////////////////////////////
        
        function activate() {
            AdminService
                .findAll()
                .then(function(users) {
                    vm.users = users;
                });
        }

        function createUser() {
            cleanSelectedUser();
            delete vm.selected._id;

            AdminService
                .create(vm.selected)
                .then(function(user) {
                    activate();
                    clearSelection();
                }, function(res) {
                    console.log('Create Error!', res); 
                });
        }

        function editUser() {
            cleanSelectedUser();

            AdminService
                .update(vm.selected._id, vm.selected)
                .then(function(user) {
                    activate();
                    clearSelection();
                }, function(res) {
                    console.log('Edit Error!', res); 
                });
        }

        function cleanSelectedUser() {
            vm.selected.roles = (vm.selected.roleString || '')
                .split(', ')
                .map(function(s) { 
                    return s.trim().toLowerCase(); 
                })
                .filter(function(s) {
                    return s === 'admin' || s === 'user';
                });
        }

        function deleteUser(user) {
            AdminService
                .delete(user._id)
                .then(function(users) {
                    activate();
                });
        }

        function selectUser(index, user) {
            vm.selectedIndex = index;
            vm.selected = angular.copy(user);
            vm.selected.roleString = vm.selected.roles.join(", ");
        }

        function clearSelection() {
            vm.selectedIndex = undefined;
            vm.selected = undefined;
        }

        function createSortFunction() {
            var SORT_STATES = [ 'None', 'Regular', 'Reversed' ];

            var currentSortState = 0;

            return function(field) {
                if (field !== vm.predicate) {
                    currentSortState = 1;
                    vm.predicate = field;
                    vm.reversed = false;
                } else {
                    currentSortState = (currentSortState + 1) % SORT_STATES.length;
                    switch (currentSortState) {
                        case 0:
                            vm.predicate = undefined;
                            vm.reversed = false;
                            break;
                        case 1:
                            vm.predicate = field;
                            vm.reversed = false;
                            break;
                        case 2: 
                            vm.predicate = field;
                            vm.reversed = true;
                            break;
                    }
                }
            }
        }
    }

}());
