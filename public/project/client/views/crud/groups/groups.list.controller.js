(function() {
    'use strict';
    
    angular
        .module('TheBookClub')
        .controller('GroupListController', GroupListController);

    GroupListController.$inject = [ 'GroupService' ];
    function GroupListController(GroupService) {
        var vm = this;

        var selectedIndex;
        vm.selected = emptySelection();
        vm.groups = [];

        vm.addGroup = addGroup;
        vm.deleteGroup = deleteGroup;
        vm.updateGroup = updateGroup;
        vm.selectGroup = selectGroup;
        
        activate();

        function activate() {
            GroupService.getAllGroups(function (groups) {
                setGroups(groups);
            });
        }

        function addGroup() {
            var group = {
                name: vm.selected.name,
                visibility: vm.selected.isPublic ? 'PUBLIC' : 'PRIVATE',
                admins: [],
                members: [],
                readings: []
            };

            GroupService.createGroup(group, function(group) {
                normalizeGroup(group);
                vm.groups.push(group);

                resetSelection();
            });
        }
        
        function updateGroup() {
            var group = {
                name: vm.selected.name,
                visibility: vm.selected.isPublic ? 'PUBLIC' : 'PRIVATE',
                admins: vm.selected.admins,
                members: vm.selected.members,
                readings: vm.selected.readings
            };

            GroupService.updateGroup(vm.selected.id, group, function(updated) {
                normalizeGroup(updated);
                vm.groups[selectedIndex] = updated;
                
                resetSelection();
            });

        }

        function deleteGroup(group) {
            GroupService.deleteGroup(group.id, function(groups) {
                setGroups(groups);
            });
        }

        function selectGroup(index) {
            selectedIndex = index;

            var selected = vm.groups[index];
            vm.selected.id = selected.id;
            vm.selected.name = selected.name;
            vm.selected.visibility = selected.visibility;
            vm.selected.isPublic = selected.isPublic;
            vm.selected.admins = selected.admin;
            vm.selected.members = selected.members;
            vm.selected.readings = selected.readings;
        }

        function setGroups(groups) {
            var theGroups = [];

            for (var i = 0; i < groups.length; i++) {
                var g = groups[i];
                
                normalizeGroup(g);

                theGroups.push(g);
            }

            vm.groups = theGroups;
        }

        function normalizeGroup(group) {
            group.isPublic = group.visibility === 'PUBLIC';
        }

        function emptySelection() {
            return {
                id: undefined,
                title: '',
                isPublic: false
            };
        }

        function resetSelection() {
            vm.selected = emptySelection();
            selectedIndex = undefined;
        }
    }
}());
