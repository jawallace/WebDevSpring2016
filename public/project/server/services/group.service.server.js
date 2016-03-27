module.exports = function(app, GroupModel, ReadingModel, UserModel) {
    'use strict';

    var utils = require('./util.js')();

    var BASE_URL = '/api/project/group';
    var GROUP_ID_URL = BASE_URL + '/:groupId';
    var READING_URL = GROUP_ID_URL + '/reading';
    var READING_ID_URL = READING_URL + '/:readingId';
    var ADMIN_URL = GROUP_ID_URL + '/admin';
    var ADMIN_ID_URL = ADMIN_URL + '/:adminId';
    var MEMBER_URL = GROUP_ID_URL + '/member';
    var MEMBER_ID_URL = MEMBER_URL + '/:memberId';

    var retrieveGroupMiddleware = groupMiddleware;

    app.get(BASE_URL, getAllGroups);
    app.post(BASE_URL, createGroup);
    
    app.get(GROUP_ID_URL,retrieveGroupMiddleware, getGroupById);
    app.put(GROUP_ID_URL, retrieveGroupMiddleware, updateGroup);
    app.delete(GROUP_ID_URL, retrieveGroupMiddleware, deleteGroup);

    app.get(READING_URL, retrieveGroupMiddleware, getReadings);
    app.post(READING_URL, retrieveGroupMiddleware, addReading);

    app.get(READING_ID_URL, retrieveGroupMiddleware, getReadingById);
    app.put(READING_ID_URL, retrieveGroupMiddleware, updateReading);
    app.delete(READING_ID_URL, retrieveGroupMiddleware, deleteReading);

    app.get(ADMIN_URL, retrieveGroupMiddleware, getAdmins);
    app.post(ADMIN_URL, retrieveGroupMiddleware, addAdmin);

    app.get(ADMIN_ID_URL, retrieveGroupMiddleware, getAdmin);
    app.delete(ADMIN_ID_URL, retrieveGroupMiddleware, removeAdmin);

    app.get(MEMBER_URL, retrieveGroupMiddleware, getMembers);
    app.post(MEMBER_URL, retrieveGroupMiddleware, addMember);
    
    app.get(MEMBER_ID_URL, retrieveGroupMiddleware, getMember);
    app.delete(MEMBER_ID_URL, retrieveGroupMiddleware, removeMember);

    ///////////////////////////////////////
   
    var GROUP_ERR_MSG = 'Group not found.';

    function getAllGroups(req, res) {
        res.json(GroupModel.findAll());
    }
    
    function createGroup(req, res) {
        utils.sendOr404(GroupModel.create(req.body), res, 'Failed to create group');
    }
    
    function getGroupById(req, res) {
        utils.sendOr404(GroupModel.findById(req.params.groupId), res, GROUP_ERR_MSG);    
    }
    
    function updateGroup(req, res) {
        utils.sendOr404(GroupModel.update(req.params.groupId, req.body), res, GROUP_ERR_MSG);
    }
    
    function deleteGroup(req, res) {
        utils.sendOr404(GroupModel.delete(req.params.groupId), res, GROUP_ERR_MSG);
    }
    
    function getReadings(req, res) {
        var readings = req.group.readings.map(function(r) {
            return ReadingModel.findById(r);
        });

        if (readings.some(function(r) { return !r; })) {
            res.status(404).send('READING FOR GROUP NOT FOUND! INCONSISTENT SERVER STATE!');
        } else {
            res.json(readings);
        }
    }
   
    var READING_ERR_MSG = 'Reading not found.';
    function addReading(req, res) {
        var reading = ReadingModel.create(req.body.id);
  
        utils.sendOr404(GroupModel.addReading(req.group.id, reading.id), res, 'Failed to create reading');
    }

    function getReadingById(req, res) {
        utils.sendOr404(ReadingModel.findById(req.params.readingId), res, READING_ERR_MSG);
    }
    
    function updateReading(req, res) {
        utils.sendOr404(ReadingModel.update(req.params.readingId, req.body), res, READING_ERR_MSG);
    }
    
    function deleteReading(req, res) {
        var reading = ReadingModel.delete(req.params.readingId);

        utils.sendOr404(GroupModel.removeReading(req.group.id, req.params.readingId), res, READING_ERR_MSG);
    }
   
    var USER_ERR_MSG = 'User not found.';
    function getAdmins(req, res) {
        var admins = req.group.admins.map(function(u) {
            return UserModel.findById(u);
        });

        if (admins.some(function(u) { return !u; })) {
            res.status(404).send('ADMIN FOR GROUP NOT FOUND! INCONSISTENT SERVER STATE!');
        } else {
            res.json(admins);
        }
    }
    
    function addAdmin(req, res) {
        var admin = UserModel.findById(req.body.id);
        admin.groups.push(req.group.id);

        if (! admin) {
            res.status(404).send(USER_ERR_MSG);    
        } else {
            utils.sendOr404(GroupModel.addAdmin(req.group.id, admin.id), res, USER_ERR_MSG);
        }
    }
    
    function getAdmin(req, res) {
        utils.sendOr404(UserModel.findById(parseInt(req.params.adminId)), res, USER_ERR_MSG);
    }
    
    function removeAdmin(req, res) {
        utils.sendOr404(GroupModel.removeAdmin(req.group.id, req.params.adminId), res, USER_ERR_MSG);
    }
    
    function getMembers(req, res) {
        var members = req.group.members.map(function(u) {
            return UserModel.findById(u);
        });

        if (members.some(function(u) { return !u; })) {
            res.status(404).send('MEMBER FOR GROUP NOT FOUND! INCONSISTENT SERVER STATE!');
        } else {
            res.json(members);
        }
    }
    
    function addMember(req, res) {
        var member = UserModel.findById(req.body.id);
        member.groups.push(req.group.id);
        
        if (! member) {
            res.status(404).send(USER_ERR_MSG);    
        } else {
            utils.sendOr404(GroupModel.addMember(req.group.id, member.id), res, USER_ERR_MSG);
        }
    }
    
    function getMember(req, res) {
        utils.sendOr404(UserModel.findById(parseInt(req.params.memberId)), res, USER_ERR_MSG);
    }
    
    function removeMember(req, res) {
        utils.sendOr404(GroupModel.removeMember(req.group.id, req.params.memberId), res, USER_ERR_MSG);
    }

    function groupMiddleware(req, res, next) {
        var group = GroupModel.findById(req.params.groupId);
        
        if (group) {
            req.group = group;
            next();
        } else {
            res.status(404).send(GROUP_ERR_MSG);
        }
    }
}
