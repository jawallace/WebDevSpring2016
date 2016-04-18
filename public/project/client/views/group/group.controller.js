(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('GroupController', GroupController);

    GroupController.$inject = [ 'GroupService' ];
    function GroupController(GroupService) {
        var vm = this;

        vm.newGroup = { name: '', public: true };
        vm.validation = { name: { valid: true } };

        vm.createGroup = createGroup;

        /////////////////////////////////

        function createGroup() {
            if (! valid()) {
                return;
            }

            var g = {
                name: vm.newGroup.name,
                visibility: vm.newGroup.public ? 'PUBLIC' : 'PRIVATE'
            };
            
            GroupService
                .createGroup(g)
                .then(function(group) {
                    console.log('created new group!', group);
                    resetNewGroup();
                })
                .catch(function(res) {
                    console.log('err!', res);   
                });
        }

        function resetNewGroup() {
            vm.newGroup = {
                name: '',
                public: true
            };

            vm.validation = {
                name: {
                    valid: true
                }
            };
        }

        function valid() {
            var result = true;
            if (! vm.newGroup.name) {
                vm.validation.name = {
                    valid: false,
                    msg: 'Cannot be empty.'
                };
                result = false;
            }
            
            return result;
        }
    }
}());
