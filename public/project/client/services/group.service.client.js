(function() {
    'use strict';

    angular
        .module('TheBookClub')
        .factory('GroupService', GroupService);

    function GroupService() {
        var theGroups = [];

        var service = {
            groups: theGroups,

            createGroup: createGroup,
            getGroupById: getGroupById,
            getAllGroups: getAllGroups,
            updateGroup: updateGroup,
            deleteGroup: deleteGroup,
            addReadingToGroup: addReadingToGroup,
            addMemberToGroup: addMemberToGroup,
            addAdminToGroup: addAdminToGroup,
            removeReadingFromGroup: removeReadingFromGroup,
            removeMemberFromGroup: removeMemberFromGroup,
            removeAdminFromGroup: removeAdminFromGroup
        };

        activate();

        return service;

        function activate() {
            theGroups.push({
                id: 0,
                name: 'Culture Group',
                admins: [ 123 ],
                members: [ 234, 345 ],
                readings: [ 0, 1 ],
                visibility: 'PUBLIC'
            });
            
            theGroups.push({
                id: 1,
                name: 'Jeff\'s Secret Culture Group',
                admins: [ 456 ],
                members: [ 234 ],
                readings: [ 2 ],
                visibility: 'PRIVATE'
            });
        }

        function createGroup(group, callback) {
            group.id = new Date().getTime();

            this.groups.push(group);

            callback(group);
        }

        function getGroupById(id, callback) {
            var g = findGroup(id);

            if (g) {
                callback(g.group);
            } else {
                callback(undefined);
            }
        }

        function getAllGroups(callback) {
            callback(this.groups);
        }

        function updateGroup(id, updated, callback) {
            var g = findGroup(id);

            if (g) {
                var group = g.group;
                group.name = updated.name;
                group.admins = updated.admins;
                group.members = updated.members;
                group.readings = updated.readings;
                group.visibility = updated.visibility;
                callback(group);
            } else {
                callback(undefined);
            }
        }

        function deleteGroup(id, callback) {
            var g = findGroup(id);

            if (g) {
                this.groups.splice(g.index, 1);
            } 
            
            callback(this.groups);
        }

        function addReadingToGroup(id, reading, callback) {
            addToGroupField(id, 'readings', reading, callback);
        }

        function addMemberToGroup(id, member, callback) {
            addToGroupField(id, 'members', member, callback);
        }

        function addAdminToGroup(id, admin, callback) {
            addToGroupField(id, 'admins', admin, callback);
        }

        function removeReadingFromGroup(id, reading, callback) {
            removeFromGroupField(id, 'readings', reading, callback);
        }

        function removeMemberFromGroup(id, member, callback) {
            removeFromGroupField(id, 'members', member, callback);
        }

        function removeAdminFromGroup(id, admin, callback) {
            removeFromGroupField(id, 'admins', admin, callback);
        }

        function addToGroupField(id, field, value, callback) {
            var g = findGroup(id);

            if (g) {
                g.group[field].push(value);
                callback(g.group);
            } else {
                callback(undefined);
            }
        }
        
        function removeFromGroupField(id, field, value, callback) {
            var g = findGroup(id);

            if (g) {
                var index = g.group[field].indexOf(value);
                if (index >= 0) {
                    g.group[field].splice(index, 1);
                }
                callback(g.group);
            } else {
                callback(undefined);
            }
        }

        function findGroup(id) {
            var length = theGroups.length;

            for (var i = 0; i < length; i++) {
                var group = theGroups[i];

                if (group.id === id) {
                    return {
                        index: i,
                        group: group 
                    };
                }
            }
        }

    }
}());
