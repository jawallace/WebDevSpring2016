var mongoose = require('mongoose');
var GroupModel;
var chai = require('chai');
var expect = chai.expect;

describe('GroupModel', function() {
    'use strict';

    before(function(done) {
        GroupModel = require('../../../../../public/project/server/models/group/group.model.js')(mongoose);
        done();
    });

    describe('#create()', function() {
        it('should insert a group into the database', function(done) {
            var group = {
                name: 'A group',
                admins: [mongoose.Schema.ObjectId()],
                members: [], 
                visibility: 'PUBLIC'
            };

            GroupModel
                .create(group)
                .then(function(group) {
                    expect(group).to.exist;
                    done();
                })
                .catch(done);
        });

        it('should fail if a group does not have an admin', function(done) {
            var group = {
                name: 'A group',
                admins: [],
                members: [], 
                visibility: 'PUBLIC'
            };

            GroupModel
                .create(group)
                .then(done)
                .catch(function(err) {
                    done();
                });
        });
    });

    describe('#findById()', function() {
        var id;
        var testGroup = {
            name: 'A group',
            admins: [mongoose.Types.ObjectId()],
            visibility: 'PUBLIC'
        };

        before(function(done) {
            GroupModel
                .create(testGroup)
                .then(function(group) {
                    id = group._id;
                    done();
                })
                .catch(done);
        });
        
        it('should find an entry that exists', function(done) {
            GroupModel
                .findById(id)
                .then(function(group) {
                    expect(group).to.exist;
                    expect(group._id.toString()).to.equal(id.toString());
                    done();
                })
                .catch(done);
        });

        it('should not find an entry that does not exist', function(done) {
            GroupModel
                .findById(mongoose.Types.ObjectId())
                .then(function(group) {
                    expect(group).to.not.exist;
                    done();
                })
                .catch(done);
        });
    });
    
    describe('#update()', function() {
        var id;
        var testGroup = {
            name: 'group', 
            admins: [mongoose.Types.ObjectId()],
            visibility: 'PUBLIC'
        };

        before(function(done) {
            GroupModel
                .create(testGroup)
                .then(function(group) {
                    id = group._id;
                    done();
                })
                .catch(done);
        });

        it('should update the group', function(done) {
            GroupModel
                .update(id, { name: 'another name' })
                .then(function(group) {
                    expect(group._id.toString()).to.equal(id.toString());
                    expect(group.name).to.equal('another name');
                    done();
                })
                .catch(done);
        });
    });
    
    describe('#delete()', function() {
        var id;
        var testGroup = {
            name: 'group', 
            admins: [mongoose.Types.ObjectId()],
            visibility: 'PUBLIC'
        };

        before(function(done) {
            GroupModel
                .create(testGroup)
                .then(function(group) {
                    id = group._id;
                    done();
                })
                .catch(done);
        });

        it('should delete the group', function(done) {
            GroupModel
                .delete(id)
                .then(function(groups) {
                    groups.forEach(function(r) {
                        expect(r._id.toString()).to.not.equal(id.toString());
                    });
                    done();
                })
                .catch(done);
        });
    });

    describe('#{add,remove}Member', function() {
        var newMember = mongoose.Types.ObjectId();
        var groupId;
        var testGroup = {
            name: 'group',
            admins: [mongoose.Types.ObjectId()],
            members: [mongoose.Types.ObjectId()],
            visibility: 'PUBLIC'
        };

        before(function(done) {
            GroupModel
                .create(testGroup)
                .then(function(group) {
                    groupId = group._id;
                    done();
                })
                .catch(done);
        });

        it('should correctly add and remove members', function(done) {
            GroupModel
                .addMember(groupId, newMember)
                .then(function(group) {
                    expect(group.members).to.have.lengthOf(2);
                    expect(group.members.some(function(m) {
                        return m.toString() === newMember.toString(); 
                    })).to.be.true;

                    GroupModel
                    .removeMember(groupId, newMember)
                    .then(function(group) {
                        expect(group.members).to.have.lengthOf(1);
                        expect(group.members.some(function(m) {
                            return m.toString() === newMember.toString(); 
                        })).to.be.false;
                        done();
                    })
                    .catch(done);
                })
                .catch(done);
        });
        
        it('should not affect other members if the member does not exist', function(done) {
            GroupModel
                .removeMember(groupId, mongoose.Types.ObjectId())
                .then(function(group) {
                    expect(group.members).to.have.lengthOf(1);
                    done();
                })
                .catch(done);
        });
    });
    
    describe('#{add,remove}Admin', function() {
        var newAdmin = mongoose.Types.ObjectId();
        var oldAdmin = mongoose.Types.ObjectId();
        var groupId;
        var testGroup = {
            name: 'group',
            admins: [oldAdmin],
            visibility: 'PUBLIC'
        };

        before(function(done) {
            GroupModel
                .create(testGroup)
                .then(function(group) {
                    groupId = group._id;
                    done();
                })
                .catch(done);
        });

        it('should correctly add and remove admins', function(done) {
            GroupModel
                .addAdmin(groupId, newAdmin)
                .then(function(group) {
                    expect(group.admins).to.have.lengthOf(2);
                    expect(group.admins.some(function(m) {
                        return m.toString() === newAdmin.toString(); 
                    })).to.be.true;

                    GroupModel
                        .removeAdmin(groupId, newAdmin)
                        .then(function(group) {
                            expect(group.admins).to.have.lengthOf(1);
                            expect(group.admins.some(function(m) {
                                return m.toString() === newAdmin.toString(); 
                            })).to.be.false;
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });
        
        it('should not affect other admins if the admin does not exist', function(done) {
            GroupModel
                .removeAdmin(groupId, mongoose.Types.ObjectId())
                .then(function(group) {
                    expect(group.admins).to.have.lengthOf(1);
                    done();
                })
                .catch(done);
        });
        
        it('should throw an error if the last admin is removed', function(done) {
            GroupModel
                .removeAdmin(groupId, oldAdmin)
                .then(done)
                .catch(function(err) {
                    done();
                });
        });
    });

    describe('#findByUser()', function() {
        var userId = mongoose.Types.ObjectId();
        var testGroup = {
            name: 'group 1',
            admins: [userId],
            visibility: 'PUBLIC'
        };
        var testGroup2 = {
            name: 'group 2',
            admins: [mongoose.Types.ObjectId()],
            members: [userId],
            visibility: 'PUBLIC'
        };

        before(function(done) {
            GroupModel
                .create(testGroup)
                .then(function() {
                    GroupModel
                        .create(testGroup2)
                        .then(function() {
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });

        it('should find all groups for the group, sorted by most recent', function(done) {
            GroupModel
                .findByUser(userId)
                .then(function(groups) {
                    expect(groups.admin).to.have.lengthOf(1);
                    expect(groups.member).to.have.lengthOf(1);
                    expect(groups.admin[0].name).to.equal('group 1');
                    expect(groups.member[0].name).to.equal('group 2');
                    done();
                })
                .catch(done);
        });
    });

    describe('#search()', function() {
        var testGroup = {
            name: 'culture group',
            admins: [mongoose.Types.ObjectId()],
            visibility: 'PUBLIC'
        };
        var testGroup2 = {
            name: 'the culture book club',
            admins: [mongoose.Types.ObjectId()],
            visibility: 'PUBLIC'
        };
        
        before(function(done) {
            GroupModel
                .create(testGroup)
                .then(function() {
                    GroupModel
                        .create(testGroup2)
                        .then(function() {
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });

        it('should find all matches', function(done) {
            GroupModel
                .search('culture')
                .then(function(groups) {
                    expect(groups).to.have.lengthOf(2);
                    groups.forEach(function(g) {
                        expect(g.name).to.be.oneOf([ testGroup.name, testGroup2.name ]);
                    });
                    done();
                })
                .catch(done);
        });
        
        it('should find all matches regardless of case', function(done) {
            GroupModel
                .search('CULTURE')
                .then(function(groups) {
                    expect(groups).to.have.lengthOf(2);
                    groups.forEach(function(g) {
                        expect(g.name).to.be.oneOf([ testGroup.name, testGroup2.name ]);
                    });
                    done();
                })
                .catch(done);
        });
        
        it('should not return other groups', function(done) {
            GroupModel
                .search('FOObar')
                .then(function(groups) {
                    expect(groups).to.have.lengthOf(0);
                    done();
                })
                .catch(done);
        });
    });

});
