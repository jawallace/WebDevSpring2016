(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('GroupDetailController', GroupDetailController);

    GroupDetailController.$inject = [ '$stateParams', 'GroupService', 'ReadingService', 'user' ];
    function GroupDetailController($stateParams, GroupService, ReadingService, user) {
        var vm = this;

        vm.group;
        vm.currentReading;
        vm.pastReadings;
        vm.isAdmin;
        vm.editingCurrentReading = false;

        vm.getLoc = getLocation;
        vm.addNewReading = addNewReading;
        vm.removeCurrentReading = removeCurrentReading;
        vm.toggleEditing = toggleEditing;

        activate();

        /////////////////////////////////

        function activate() {
            var loc = { group: $stateParams.groupId };

            _getGroup(loc);
            _getReadings(loc);
        }

        function getLocation(reading) {
            return {
                group: $stateParams.groupId,
                reading: reading
            };
        }

        function addNewReading() {

        }

        function removeCurrentReading() {
        
        }

        function toggleEditing() {
            vm.editingCurrentReading = !vm.editingCurrentReading;
        }

        function _getGroup(loc) {
            GroupService
                .getGroupById(loc)
                .then(function(group) {
                    vm.group = group;
                    
                    vm.isAdmin = group.admins.indexOf(user._id) > -1;
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
        }

        function _getReadings(loc) {
            ReadingService
                .getReadingsForGroup(loc)
                .then(function(readings) {
                    vm.currentReading = undefined;
                    vm.pastReadings = [];
                    if (readings.length) {
                        vm.currentReading = readings[0];
                    }
                    
                    if (readings.length > 2) {
                        readings.shift();
                        vm.pastReadings = readings;
                    }
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
        }
    }
}());
