module.exports = function(mongoose) {
    'use strict';

    var utils = require('../../utils/util.js')();
    var GroupModel = require('./group.schema.js')(mongoose);

    var service = utils.deferService({
        create: createGroup,
        findById: getGroupById,
        findAll: getAllGroups,
        update: updateGroup,
        delete: deleteGroup,
        addMember: addMemberToGroup,
        addAdmin: addAdminToGroup,
        removeMember: removeMemberFromGroup,
        removeAdmin: removeAdminFromGroup,
        findByUser: findGroupsForUser
    });

    return service;

    /////////////////////////////////////////

    function createGroup(resolve, reject, group) {
        GroupModel.create(group, function(err, group) {
            return err ? reject(err) : resolve(group); 
        });
    }

    function getGroupById(resolve, reject, id) {
        GroupModel.findById(id, function(err, group) {
            return err ? reject(err) : resolve(group); 
        });
    }

    function getAllGroups(resolve, reject) {
        GroupModel.find(function(err, group) {
            return err ? reject(err) : resolve(group); 
        });
    }

    function updateGroup(resolve, reject, id, updated) {
        GroupModel.findById(id, function(err, group) {
            if (err) {
                return reject(err);
            }

            utils.extend(group, updated);

            group.save(function(err, updatedGroup) {
                return err ? reject(err) : resolve(group); 
            });
        });
    }

    function deleteGroup(resolve, reject, id) {
        GroupModel.findById(id).remove(function(err) {
            if (err) {
                return reject(err);
            }

            GroupModel.find(function(err, groups) {
                return err ? reject(err) : resolve(groups); 
            });
        });
    }

    function addMemberToGroup(resolve, reject, id, member) {
        GroupModel.findById(id, function(err, group) {
            if (err) {
                return err;
            }

            group.members.push(member);

            group.save(function(err, updatedGroup) {
                return err ? reject(err) : resolve(group);  
            });
        });
    }

    function addAdminToGroup(resolve, reject, id, admin) {
        GroupModel.findById(id, function(err, group) {
            if (err) {
                return err;
            }

            group.admins.push(admin);

            group.save(function(err, updatedGroup) {
                return err ? reject(err) : resolve(group);  
            });
        });
    }

    function removeMemberFromGroup(resolve, reject, id, member) {
        GroupModel.findById(id, function(err, group) {
            if (err) {
                return err;
            }
            
            var i = group.members.indexOf(member);
            if (i < 0) {
                return resolve(group);
            }

            group.members.splice(i, 1);

            group.save(function(err, updatedGroup) {
                return err ? reject(err) : resolve(group);  
            });
        });
    }

    function removeAdminFromGroup(resolve, reject, id, admin) {
        GroupModel.findById(id, function(err, group) {
            if (err) {
                return err;
            }
            
            var i = group.admins.indexOf(admin);
            if (i < 0) {
                return resolve(group);
            }

            group.admins.splice(i, 1);

            group.save(function(err, updatedGroup) {
                return err ? reject(err) : resolve(group);  
            });
        });
    }

    function findGroupsForUser(resolve, reject, userId) {
        var response = {
            member: [],
            admin: []
        };

        GroupModel.find({ members: userId }, function(err, memberGroups) {
            if (err) {
                return reject(err);
            }

            response.member = memberGroups;
            GroupModel.find({ admins: userId }, function(err, adminGroups) {
                if (err) {
                    return reject(err);
                }

                response.admin = adminGroups;
                return resolve(response);
            });
        });
    }

}
