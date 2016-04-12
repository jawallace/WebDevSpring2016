var mongoose = require('mongoose');
var UserModel;
var chai = require('chai');
var expect = chai.expect;
var q = require('q');

describe('UserModel', function() {
    'use strict';

    before(function(done) {
        UserModel = require('../../../../../public/project/server/models/user/user.model.js')(mongoose);
        done();
    });

    describe('#create()', function() {
        it('should insert a user into the database', function(done) {
            var user = {
                username: 'user 1',
                password: 'foo'
            };

            UserModel
                .create(user)
                .then(function(user) {
                    expect(user).to.exist;
                    expect(user.username).to.equals('user 1');
                    done();
                })
                .catch(done);
        });

        it('should not allow the creation of a super user', function(done) {
            var user = {
                username: 'user 2',
                password: 'foo',
                sudo: true
            };

            UserModel
                .create(user)
                .then(function(user) {
                    expect(user.sudo).to.be.false;
                    done();
                })
                .catch(done);
        });
        
        it('should not allow the creation of users with duplicate user names', function(done) {
            var user = {
                username: 'user3',
                password: 'foo'
            };
            var user2 = {
                username: 'USER3',
                password: 'foo'
            };

            UserModel
                .create(user)
                .then(function() {
                    return UserModel.create(user2);            
                })
                .then(done)
                .catch(function(err) {
                    done();
                });
        });
    });

    describe('#findById()', function() {
        var id;
        var testUser = {
            username: 'user4',
            password: 'foo'
        };

        before(function(done) {
            UserModel
                .create(testUser)
                .then(function(user) {
                    id = user._id;
                    done();
                })
                .catch(done);
        });
        
        it('should find an entry that exists', function(done) {
            UserModel
                .findById(id)
                .then(function(user) {
                    expect(user).to.exist;
                    expect(user._id.toString()).to.equal(id.toString());
                    done();
                })
                .catch(done);
        });

        it('should not find an entry that does not exist', function(done) {
            UserModel
                .findById(mongoose.Types.ObjectId())
                .then(function(user) {
                    expect(user).to.not.exist;
                    done();
                })
                .catch(done);
        });
    });
    
    describe('#update()', function() {
        var id;
        var testUser = {
            username: 'user5',
            password: 'foo'
        };

        before(function(done) {
            UserModel
                .create(testUser)
                .then(function(user) {
                    id = user._id;
                    done();
                })
                .catch(done);
        });

        it('should update the user', function(done) {
            UserModel
                .update(id, { username: 'user6' })
                .then(function(user) {
                    expect(user._id.toString()).to.equal(id.toString());
                    expect(user.username).to.equal('user6');
                    done();
                })
                .catch(done);
        });

        it('should not allow the user to become a superuser', function(done) {
            UserModel
                .update(id, { sudo: true })
                .then(function(user) {
                    expect(user.sudo).to.be.false;
                    done();
                })
                .catch(done);
        });
    });
    
    describe('#delete()', function() {
        var id;
        var testUser = {
            username: 'user7',
            password: 'foo'
        };

        before(function(done) {
            UserModel
                .create(testUser)
                .then(function(user) {
                    id = user._id;
                    done();
                })
                .catch(done);
        });

        it('should delete the user', function(done) {
            UserModel
                .delete(id)
                .then(function(users) {
                    users.forEach(function(r) {
                        expect(r._id.toString()).to.not.equal(id.toString());
                    });
                    done();
                })
                .catch(done);
        });
    });

    describe('#{add,remove}Group', function() {
        var newGroup = mongoose.Types.ObjectId();
        var userId;
        var testUser = {
            username: 'user8',
            password: 'foo'
        };

        before(function(done) {
            UserModel
                .create(testUser)
                .then(function(user) {
                    userId = user._id;
                    done();
                })
                .catch(done);
        });

        it('should correctly add and remove groups', function(done) {
            UserModel
                .addGroup(userId, newGroup)
                .then(function(user) {
                    expect(user.groups).to.have.lengthOf(1);
                    expect(user.groups[0].toString()).to.equal(newGroup.toString());
                    
                    return UserModel.removeGroup(userId, newGroup);
                })
                .then(function(user) {
                    expect(user.groups).to.have.lengthOf(0);
                    done();
                })
                .catch(done);
        });
    });

});
