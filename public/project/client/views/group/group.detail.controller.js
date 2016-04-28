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
        vm.admins;
        vm.members;
        vm.requesters;
        vm.isAdmin;
        vm.isGroupMember;
        vm.editingCurrentReading = false;
        vm.newReading;
        vm.activePastReading;
        vm.page = 1;

        vm.getLoc = getLocation;
        vm.removeCurrentReading = removeCurrentReading;
        vm.selectBookForNewReading = selectBookForNewReading;
        vm.toggleEditing = toggleEditing;
       
        vm.nextPage = nextPage;
        vm.prevPage = prevPage;
        vm.removePastReading = removePastReading;

        vm.removeMember = removeMember;
        vm.promoteMember = promoteMember;
        vm.approveRequest = approveRequest;
        vm.rejectRequest = rejectRequest;
        activate();

        /////////////////////////////////

        function activate() {
            var loc = { group: $stateParams.groupId };

            _getGroup(loc);
            _getReadings(loc);
            _getUsers(loc);
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
            $(".modal-backdrop").remove();
            $('body').removeClass('modal-open');

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

        function nextPage() {
            vm.page = vm.page + 1;
            vm.activePastReading = vm.pastReadings[vm.page - 1];
        }

        function prevPage() {
            vm.page = vm.page - 1;
            vm.activePastReading = vm.pastReadings[vm.page - 1];
        }

        function removePastReading() {
            if (! vm.activePastReading) {
                return;
            }
            
            var loc = { group: $stateParams.groupId };
            ReadingService
                .deleteReading(loc, vm.activePastReading._id)
                .then(function() {
                    vm.page = 1;
                    _getReadings(loc); 
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
        }

        function removeMember(member) {
            var loc = { group: $stateParams.groupId };
            GroupService
                .removeMemberFromGroup(loc, member._id)
                .then(function() {
                    _getUsers(loc);    
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
        }

        function promoteMember(member) {
            var loc = { group: $stateParams.groupId };
            GroupService
                .removeMemberFromGroup(loc, member._id)
                .then(function() {
                    return GroupService.addAdminToGroup(loc, member._id);
                })
                .then(function() {
                    _getUsers(loc);
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
        }

        function approveRequest(requester) {
            var loc = { group: $stateParams.groupId };
            GroupService
                .removeRequesterFromGroup(loc, requester._id)
                .then(function() {
                    return GroupService.addMemberToGroup(loc, requester._id);
                })
                .then(function() {
                    _getUsers(loc); 
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
        }
        
        function rejectRequest(requester) {
            var loc = { group: $stateParams.groupId };
            GroupService
                .removeRequesterFromGroup(loc, requester._id)
                .then(function() {
                    _getUsers(loc); 
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
        }

        function _getGroup(loc) {
            GroupService
                .getGroupById(loc)
                .then(function(group) {
                    vm.group = group;
                    
                    vm.isAdmin = group.admins.indexOf(user._id) > -1;
                    vm.isGroupMember = vm.isAdmin || group.members.indexOf(user._id) > -1;
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
                    console.log('_getReadings', readings);
                    readings.forEach(function(r) {
                        r.loc =  { group: loc.group, reading: r._id };
                    });

                    vm.currentReading = undefined;
                    vm.activePastReading = undefined;
                    vm.pastReadings = [];
                    if (readings.length) {
                        vm.currentReading = readings[0];
                    }
                    
                    if (readings.length > 1) {
                        readings.shift();
                        vm.pastReadings = readings;
                        vm.activePastReading = vm.pastReadings[0];
                    }
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
        }

        function _getUsers(loc) {
            GroupService
                .getAdminsForGroup(loc)
                .then(function(admins) {
                    vm.admins = admins;                    
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
            
           GroupService
                .getMembersForGroup(loc)
                .then(function(members) {
                    vm.members = members;
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
           
           GroupService
                .getRequestersForGroup(loc)
                .then(function(requesters) {
                    vm.requesters = requesters;
                })
                .catch(function(err) {
                    //TODO
                    console.log(err);
                });
        }
    }
}());
