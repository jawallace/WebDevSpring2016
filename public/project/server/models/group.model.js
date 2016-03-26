module.exports = function() {
    'use strict';

    var utils = require('./util.js')();

    var theGroups = [];

    var service = {
        groups: theGroups,
        create: createGroup,
        findById: getGroupById,
        findAll: getAllGroups,
        update: updateGroup,
        delete: deleteGroup,
        addReading: addReadingToGroup,
        addMember: addMemberToGroup,
        addAdmin: addAdminToGroup,
        removeReading: removeReadingFromGroup,
        removeMember: removeMemberFromGroup,
        removeAdmin: removeAdminFromGroup
    };

    activate();

    return service;

    /////////////////////////////////////////

    function activate() {
        var mock = require('./group.mock.json');

        for (var i = 0; i < mock.length; i++) {
            theGroups.push(mock[i]);    
        }
    }

    function createGroup(group) {
        group.id = utils.guid();

        this.groups.push(group);

        return group;
    }

    function getGroupById(id) {
        var g = utils.findById(this.groups, id);

        if (g) {
            return g.value;
        }
    }

    function getAllGroups() {
        return this.groups;
    }

    function updateGroup(id, updated) {
        var g = utils.findById(this.groups, id);

        if (g) {
            utils.extend(g.value, updated);
            return g.value;
        }
    }

    function deleteGroup(id) {
        var g = utils.findById(this.groups, id);

        if (g) {
            this.groups.splice(g.index, 1);
            return g.value; 
        } 
    }

    function addReadingToGroup(id, reading) {
        return addToGroupField(id, 'readings', reading);
    }

    function addMemberToGroup(id, member) {
        return addToGroupField(id, 'members', member);
    }

    function addAdminToGroup(id, admin) {
        return addToGroupField(id, 'admins', admin);
    }

    function removeReadingFromGroup(id, reading) {
        return removeFromGroupField(id, 'readings', reading);
    }

    function removeMemberFromGroup(id, member) {
        return removeFromGroupField(id, 'members', member);
    }

    function removeAdminFromGroup(id, admin) {
        return removeFromGroupField(id, 'admins', admin);
    }

    function addToGroupField(id, field, value) {
        var g = utils.findById(theGroups, id);

        if (g) {
            g.value[field].push(value);
            return g.value;
        }
    }
    
    function removeFromGroupField(id, field, value) {
        var g = utils.findById(theGroups, id);

        if (g) {
            var index = g.value[field].indexOf(value);
            if (index >= 0) {
                g.value[field].splice(index, 1);
            }

            return g.value;
        }
    }

}
