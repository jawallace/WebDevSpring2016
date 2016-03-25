module.exports = function(app, GroupModel, ReadingModel, UserService) {
    'use strict';

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

    app.delete(ADMIN_ID_URL, retrieveGroupMiddleware, removeAdmin);

    app.get(MEMBER_URL, retrieveGroupMiddleware, getUsers);
    app.post(MEMBER_URL, retrieveGroupMiddleware, addUser);
    
    app.delete(MEMBER_ID_URL, retrieveGroupMiddleware, removeMember);

    ///////////////////////////////////////
    
    function getAllGroups(req, res) {

    }
    
    function createGroup(req, res) {

    }
    
    function getGroupById(req, res) {

    }
    
    function updateGroup(req, res) {

    }
    
    function deleteGroup(req, res) {

    }
    
    function getReadings(req, res) {

    }
    
    function addReading(req, res) {

    }

    function getReadingById(req, res) {

    }
    
    function updateReading(req, res) {

    }
    
    function deleteReading(req, res) {

    }
    
    function getAdmins(req, res) {

    }
    
    function addAdmin(req, res) {

    }
    
    function removeAdmin(req, res) {

    }
    
    function getMembers(req, res) {

    }
    
    function addMember(req, res) {

    }
    
    function removeMember(req, res) {

    }

    function groupMiddleware(req, res, next) {

    }
}
