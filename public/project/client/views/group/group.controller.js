(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('GroupController', GroupController);

    GroupController.$inject = [ 'GroupService', 'user', '$state' ];
    function GroupController(GroupService, user, $state) {
        var vm = this;

        vm.newGroup = { name: '', public: true };
        vm.validation = { name: { valid: true } };
        vm.groupQuery;
        vm.searchResults = [];
        vm.user = user;

        vm.createGroup = createGroup;
        vm.searchForGroup = searchForGroup;
        vm.joinGroup = joinGroup;

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

        function searchForGroup() {
            if (! vm.groupQuery) {
                return;
            }

            GroupService
                .searchForGroups(vm.groupQuery)
                .then(function(groups) {
                    groups.forEach(function(g) {
                        console.log(vm.user);
                        g.joinable = (g.visibility === 'PUBLIC' && vm.user.groups.indexOf(g._id) < 0);
                    });

                    vm.searchResults = groups; 
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);  
                });
        }

        function joinGroup(group) {
            var loc = { group: group._id };

            GroupService
                .addMemberToGroup(loc, user._id)
                .then(function() {
                    $state.go('group.detail', { groupId: group._id });
                })
                .catch(function(err) {
                    //TODO
                    console.log(err); 
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
