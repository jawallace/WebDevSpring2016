module.exports = function(app, GroupModel, UserModel, security) {
    'use strict';

    var utils = require('../utils/util.js')();
    var q = require('q');

    var BASE_URL = '/api/project/group';
    var GROUP_ID_URL = BASE_URL + '/:groupId';
    
    var ADMIN_URL = GROUP_ID_URL + '/admin';
    var ADMIN_ID_URL = ADMIN_URL + '/:userId';
    var MEMBER_URL = GROUP_ID_URL + '/member';
    var MEMBER_ID_URL = MEMBER_URL + '/:userId';
    var REQUESTER_URL = GROUP_ID_URL + '/requester';
    var REQUESTER_ID_URL = REQUESTER_URL + '/:userId';
    var USER_URL = '/api/project/user/:userId/group';

    app.get(    BASE_URL,                                               getAllGroups);
    app.post(   BASE_URL,       security.auth,                          createGroup);
    
    app.get(    GROUP_ID_URL,                                           getGroupById);
    app.put(    GROUP_ID_URL,   security.auth, security.admin,          updateGroup);
    app.delete( GROUP_ID_URL,   security.auth, security.admin,          deleteGroup);

    app.get(    ADMIN_URL,                                              getAdmins);
    app.post(   ADMIN_URL,      security.auth, security.admin,          addAdmin);

    app.get(    ADMIN_ID_URL,                                           getAdmin);
    app.delete( ADMIN_ID_URL,   security.auth, security.admin,          removeAdmin);

    app.get(    MEMBER_URL,                                             getMembers);
    app.post(   MEMBER_URL,     security.auth, security.adminOrPublic,  addMember);
    
    app.get(    MEMBER_ID_URL,                                          getMember);
    app.delete( MEMBER_ID_URL,  security.auth, security.adminOrSelf,    removeMember);
    
    app.get(    REQUESTER_URL,                                          getRequesters);
    app.post(   REQUESTER_URL, security.auth,                           addRequester);
    app.delete( REQUESTER_ID_URL,  security.auth, security.adminOrSelf, removeRequester);

    app.get(    USER_URL,                                               getGroupsForUser);

    ///////////////////////////////////////
   
    var GROUP_ERR_MSG = 'Group not found.';

    function getAllGroups(req, res) {
        if (req.query.q) {
            GroupModel
                .search(req.query.q)
                .then(function(groups) {
                    res.json(groups);
                })
                .catch(function(err) {
                    res.status(500).json(err);
                });
        } else {
            GroupModel
                .findAll()
                .then(function(groups) {
                    res.json(groups);
                })
                .catch(function(err) {
                    res.status(500).json(err);
                });
        }
    }
    
    function createGroup(req, res) {
        var group = req.body;
        if (! group.admins) {
            group.admins = [ req.user._id ];
        }

        GroupModel
            .create(group)
            .then(function(group) {

                UserModel
                    .addGroup(req.user._id, group._id)
                    .then(function(user) {
                        req.login(user, function(err) {
                            if (err) {
                                res.status(500).json(err);
                            } else {
                                res.json(group);
                            }
                        });
                    })
                    .catch(function(err) {
                        res.status(400).json(err);
                    });

            })
            .catch(function(err) {
                res.status(400).json(err);
            });
    }
    
    function getGroupById(req, res) {
        res.json(req.target.group);
    }
    
    function updateGroup(req, res) {
        GroupModel
            .update(req.target.group._id, req.body)
            .then(function(group) {
                res.json(group);
            })
            .catch(function(err) {
                res.status(400).json(err);
            });
    }
    
    function deleteGroup(req, res) {
        GroupModel
            .delete(req.target.group._id)
            .then(function(groups) {
                res.json(groups);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
   
    var USER_ERR_MSG = 'User not found.';
    function getAdmins(req, res) {
        var admins = req.target.group.admins.map(function(admin) {
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
            .addGroup(req.body.id, req.target.group._id)
            .then(function(user) {
                return GroupModel.addAdmin(req.target.group._id, req.body.id);
            })
            .then(function(group) {
                res.json(group);            
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function getAdmin(req, res) {
        if (req.target.group.admins.indexOf(req.target.user._id) < 0) {
            res.status(404).json();
            return;
        }

        UserModel
            .findById(req.target.user._id)
            .then(function(user) {
                utils.sendOr404(user, res, USER_ERR_MSG);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function removeAdmin(req, res) {
        /*if (req.target.group.admins.length === 1) {
            res.status(400).json({ error: 'Cannot remove last admin' });
            return;
        }*/

        UserModel
            .removeGroup(req.target.user._id, req.target.group._id)
            .then(function(user) {
                return GroupModel.removeAdmin(req.target.group._id, req.target.user._id);
            })
            .then(function(group) {
                res.json(group);
            })
            .catch(function(err) {
                res.status(400).json(err);
            });
    }
    
    function getMembers(req, res) {
        var members = req.target.group.members.map(function(member) {
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
            .addGroup(req.body.id, req.target.group._id)
            .then(function(user) {
                return GroupModel.addMember(req.target.group._id, req.body.id);
            })
            .then(function(group) {
                res.json(group);            
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function getMember(req, res) {
        if (req.target.group.members.indexOf(req.target.user._id) < 0) {
            res.status(404).json();
            return;
        }

        UserModel
            .findById(req.target.user._id)
            .then(function(user) {
                utils.sendOr404(user, res, USER_ERR_MSG);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function removeMember(req, res) {
        UserModel
            .removeGroup(req.target.user._id, req.target.group._id)
            .then(function(user) {
                return GroupModel.removeMember(req.target.group._id, req.target.user._id)
            })
            .then(function(group) {
                res.json(group);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

    function getRequesters(req, res) {
        var requesters = req.target.group.requests.map(function(requester) {
            return UserModel.findById(requester);
        });
        
        q.all(requesters)
            .then(function(requesters) {
                if (requesters.some(function(m) { return !m; })) {
                    res.status(500).send('INCONSISTENT SERVER STATE');
                } else {
                    res.json(requesters);
                }
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }
    
    function addRequester(req, res) {
        var requesters = req.target.group.requests;
        var requester = req.body.id;

        var i = requesters.indexOf(requester);
        if (i > -1) {
            res.json(req.target.group);
        } else {
            requesters.push(requester);
            GroupModel
                .update(req.target.group._id, { requests: requesters })
                .then(function(group) {
                    res.json(group);
                })  
                .catch(function(err) {
                    res.status(500).json(err);
                });
        }
    }

    function removeRequester(req, res) {
        var requesters = req.target.group.requests;
        var requester = req.target.user._id;

        var i = requesters.indexOf(requester);
        if (i < 0) {
            res.json(req.target.group);
        } else {
            requesters.splice(i, 1);
            GroupModel
                .update(req.target.group._id, { requests: requesters })
                .then(function(group) {
                    res.json(group);
                })  
                .catch(function(err) {
                    res.status(500).json(err);
                });
        }
    }

    function getGroupsForUser(req, res) {
        GroupModel
            .findByUser(req.target.user._id)
            .then(function(groups) {
                res.json(groups);
            })
            .catch(function(err) {
                res.status(500).json(err);
            });
    }

}
