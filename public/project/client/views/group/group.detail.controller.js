(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .controller('GroupDetailController', GroupDetailController);

    GroupDetailController.$inject = [ '$stateParams', 'GroupService', 'ReadingService', 'user', '$state' ];
    function GroupDetailController($stateParams, GroupService, ReadingService, user, $state) {
        var vm = this;

        vm.group;
        vm.currentReading;
        vm.pastReadings;
        vm.isAdmin;
        vm.editingCurrentReading = false;
        vm.newReading;

        vm.getLoc = getLocation;
        vm.removeCurrentReading = removeCurrentReading;
        vm.selectBookForNewReading = selectBookForNewReading;
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

        function removeCurrentReading() {
            if (! vm.currentReading) {
                return;
            }
            
            var loc = { group: $stateParams.groupId };
            ReadingService
                .deleteReading(loc, vm.currentReading._id)
                .then(function() {
                    _getReadings(loc); 
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
        }

        function selectBookForNewReading() {
            var loc = { group: $stateParams.groupId };
            var reading = angular.copy(vm.newReading);

            var params = {
                selecting: true,
                onSelect: _createOnSelect(loc, reading)
            };

            // not ideal at all, but it works.
            $(".modal-backdrop").hide();

            $state.go('search', params);
        }

        function _createOnSelect(loc, reading) {
            return function(book) {
                reading.book = book;

                ReadingService
                    .createReading(loc, reading)
                    .then(function(reading) {
                        $state.go('group.detail', { groupId: loc.group });
                    })
                    .catch(function(err) {
                        // TODO
                        console.log(err);   
                    });
            }
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
                    readings.forEach(function(r) {
                        r.loc =  { group: loc.group, reading: r._id };
                    });
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
