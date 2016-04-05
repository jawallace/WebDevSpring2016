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
