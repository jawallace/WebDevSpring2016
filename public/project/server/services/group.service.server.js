module.exports = function(app, GroupModel, ReadingModel, UserModel) {
    'use strict';

    var utils = require('../utils/util.js')();
    var q = require('q');

    var BASE_URL = '/api/project/group';
    var GROUP_ID_URL = BASE_URL + '/:groupId';
    var READING_URL = GROUP_ID_URL + '/reading';
    var READING_ID_URL = READING_URL + '/:readingId';
    var ADMIN_URL = GROUP_ID_URL + '/admin';
    var ADMIN_ID_URL = ADMIN_URL + '/:adminId';
    var MEMBER_URL = GROUP_ID_URL + '/member';
    var MEMBER_ID_URL = MEMBER_URL + '/:memberId';
    var USER_URL = '/api/project/user/:userId/group';

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

    app.get(USER_URL, getGroupsForUser);

    ///////////////////////////////////////
   
    var GROUP_ERR_MSG = 'Group not found.';

    function getAllGroups(req, res) {
        GroupModel
            .findAll()
            .then(function(groups) {
                res.json(groups);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function createGroup(req, res) {
        GroupModel
            .create(req.body)
            .then(function(group) {
                res.json(group);
            })
            .catch(function(err) {
                res.status(400).json(err);
            });
    }
    
    function getGroupById(req, res) {
        res.json(req.group);
    }
    
    function updateGroup(req, res) {
        GroupModel
            .update(req.group._id, req.body)
            .then(function(group) {
                res.json(group);
            })
            .catch(function(err) {
                res.status(400).json(err);
            });
    }
    
    function deleteGroup(req, res) {
        GroupModel
            .delete(req.group._id)
            .then(function(groups) {
                res.json(groups);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function getReadings(req, res) {
        ReadingModel
            .findByGroup(req.group._id)
            .then(function(readings) {
                res.json(readings);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
   
    var READING_ERR_MSG = 'Reading not found.';
    function addReading(req, res) {
        var reading = req.body;
        reading.group = req.group._id;

        ReadingModel
            .create(reading)
            .then(function(reading) {
                res.json(reading);
            })
            .catch(function(err) {
                res.status(400).json(err);
            });
    }

    function getReadingById(req, res) {
        ReadingModel
            .findById(req.params.readingId)
            .then(function(reading) {
                utils.sendOr404(reading, res, READING_ERR);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function updateReading(req, res) {
        ReadingModel
            .update(req.params.readingId, req.body)
            .then(function(reading) {
                utils.sendOr404(reading, res, READING_ERR);
            })
            .catch(function(err) {
                res.status(400).json(err);
            });
    }
    
    function deleteReading(req, res) {
        ReadingModel
            .delete(req.params.readingId)
            .then(function(readings) {
                res.json(readings);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
   
    var USER_ERR_MSG = 'User not found.';
    function getAdmins(req, res) {
        var admins = req.group.admins.map(function(admin) {
            return UserModel.findById(admin);
        });
        
        q.all(admins)
            .then(function(admins) {
                if (admins.some(function(a) { return !a; })) {
                    res.status(500).send('INCONSISTENT SERVER STATE');
                } else {
                    res.json(admins);
                }
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function addAdmin(req, res) {
        UserModel
            .addGroup(req.body.id, req.group._id)
            .then(function(user) {
                return GroupModel.addAdmin(req.group._id, req.body.id);
            })
            .then(function(group) {
                res.json(group);            
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function getAdmin(req, res) {
        if (req.group.admins.indexOf(req.params.adminId) < 0) {
            res.status(404).json();
            return;
        }

        UserModel
            .findById(req.params.adminId)
            .then(function(user) {
                utils.sendOr404(user, res, USER_ERR_MSG);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function removeAdmin(req, res) {
        UserModel
            .removeGroup(req.params.adminId, req.group._id)
            .then(function(user) {
                return GroupModel.removeAdmin(req.group._id, req.params.id);
            })
            .then(function(group) {
                res.json(group);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function getMembers(req, res) {
        var members = req.group.members.map(function(member) {
            return UserModel.findById(member);
        });
        
        q.all(members)
            .then(function(members) {
                if (members.some(function(m) { return !m; })) {
                    res.status(500).send('INCONSISTENT SERVER STATE');
                } else {
                    res.json(members);
                }
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function addMember(req, res) {
        UserModel
            .addGroup(req.body.id, req.group._id)
            .then(function(user) {
                return GroupModel.addMember(req.group._id, req.body.id);
            })
            .then(function(group) {
                res.json(group);            
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function getMember(req, res) {
        if (req.group.members.indexOf(req.params.memberId) < 0) {
            res.status(404).json();
            return;
        }

        UserModel
            .findById(req.params.memberId)
            .then(function(user) {
                utils.sendOr404(user, res, USER_ERR_MSG);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function removeMember(req, res) {
        UserModel
            .removeGroup(req.params.memberId, req.group._id)
            .then(function(user) {
                return GroupModel.removeMember(req.group._id, req.params.id);
            })
            .then(function(group) {
                res.json(group);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

    function getGroupsForUser(req, res) {
        GroupModel
            .findByUser(req.params.userId)
            .then(function(groups) {
                res.json(groups);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
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
