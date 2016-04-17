var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('./test-app.js');
var mockgoose = require('mockgoose');
var mongoose = require('mongoose');

var authenticatedAgent;
var testData = {
    user: undefined,
    group1: undefined,
    group2: undefined,
    group3: undefined
}

function login(done) {
    authenticatedAgent = request.agent(app);

    authenticatedAgent 
        .post('/api/project/login')
        .send({ username: testData.user.username, password: 'password' })
        .end(done);
}

function resetDb(done) {
    mockgoose.reset(done);    
}

describe('GroupService', function() {
    after('GroupTest resetDb', resetDb);
    
    before('GroupTest initData', initData);
        
    before('group test login', login);

    describe('/api/project/group', function() {
        
        it('GET should return all groups', function(done) {
            request(app)
                .get('/api/project/group')
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.have.lengthOf(3);
                    res.body.forEach(function(g) {
                        expect(g.name).to.be.oneOf([ testData.group1.name, testData.group2.name, testData.group3.name ]);
                    });
                })
                .end(done);
        });
        
        it('POST should create a group', function(done) {
            authenticatedAgent
                .post('/api/project/group')
                .send({ name: 'a group', visibility: 'PUBLIC' })
                .expect(200)
                .expect(function(res) {
                    expect(res.body.name).to.exist;
                    expect(res.body.name).to.equal('a group');
                    expect(res.body.admins[0].toString()).to.equal(testData.user._id.toString());
                })
                .end(done);
        });

        it('POST should return a 401 if not authorized', function(done) {
            request(app)
                .post('/api/project/group')
                .send({ name: 'a group', visibility: 'PUBLIC' })
                .expect(401)
                .end(done);
        });
        
        it('POST should return a 400 on invalid data', function(done) {
            authenticatedAgent
                .post('/api/project/group')
                .send({ name: 'a group' })
                .expect(400)
                .end(done);
        });
    });

    describe('/api/project/group/:groupId', function() {
        
        it('GET should return a specifc group', function(done) {
            authenticatedAgent
                .get('/api/project/group/' + testData.group1._id)
                .expect(200)
                .expect(function(res) {
                    expect(res.body.name).to.equal(testData.group1.name);
                })
                .end(done);
        });

        it('PUT should update the group', function(done) {
            authenticatedAgent
                .put('/api/project/group/' + testData.group1._id)
                .send({ name: 'group 1 updated' })
                .expect(200)
                .expect(function(res) {
                    expect(res.body.name).to.equal('group 1 updated');
                })
                .end(done);
        });

        it('PUT should respond with 401 on a non-authenticated user', function(done) {
            request(app)
                .put('/api/project/group/' + testData.group1._id)
                .send({ name: 'group 1 updated 2' })
                .expect(401)
                .end(done);
        });

        it('PUT should respond with 403 for a non-admin', function(done) {
            authenticatedAgent
                .put('/api/project/group/' + testData.group2._id)
                .send({ name: 'group 2 updated 1' })
                .expect(403)
                .end(done);
        });

        it('DELETE should respond with 401 for non-authenticated users', function(done) {
            request(app)
                .delete('/api/project/group/' + testData.group3._id)
                .expect(401)
                .end(done);
        });
        
        it('DELETE should remove the group', function(done) {
            authenticatedAgent
                .delete('/api/project/group/' + testData.group3._id)
                .expect(200)
                .end(done);
        });
    });

    describe('/api/project/group/:groupId/admin', function() {
        
        it('GET should return all admins', function(done) {
            request(app)
                .get('/api/project/group/' + testData.group1._id + '/admin')
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.have.lengthOf(1);
                    expect(res.body[0].username).to.equal(testData.user.username);
                })
                .end(done);
        });

        it('POST should respond with 401 for non-authentiated users', function(done) {
            request(app)
                .post('/api/project/group/' + testData.group1._id + '/admin')
                .send(mongoose.Types.ObjectId().toString())
                .expect(401)
                .end(done);
        });
        
        it('POST should respond with 403 for non admins', function(done) {
            authenticatedAgent
                .post('/api/project/group/' + testData.group2._id + '/admin')
                .send(mongoose.Types.ObjectId().toString())
                .expect(403)
                .end(done);
        });
        
        it('POST should add a new admin', function(done) {
            var id = testData.user2._id;
            authenticatedAgent
                .post('/api/project/group/' + testData.group1._id + '/admin')
                .send({ id: id.toString() })
                .expect(200)
                .expect(function(res) {
                    expect(res.body.admins).to.include(id.toString());
                })
                .end(done);
        });
    });

    describe('/api/project/group/:groupId/admin/:userId', function() {
        
        it('GET should return a specific admin', function(done) {
            request(app)
                .get('/api/project/group/' + testData.group1._id + '/admin/' + testData.user._id)
                .expect(200)
                .expect(function(res) {
                    expect(res.body.username).to.equal(testData.user.username);
                })
                .end(done);
        });

        it('GET should return 404 for a non-existent admin', function(done) {
            request(app)
                .get('/api/project/group/' + testData.group1._id + '/admin/' + mongoose.Types.ObjectId())
                .expect(404)
                .end(done);
        });

        it('DELETE should return 401 for a non-authenticated user', function(done) {
            request(app)
                .delete('/api/project/group/' + testData.group1._id + '/admin/' + testData.user._id)
                .expect(401)
                .end(done);
        });

        it('DELETE should return 403 for a non-admin user', function(done) {
            authenticatedAgent
                .delete('/api/project/group/' + testData.group2._id + '/admin/' + testData.user._id)
                .expect(403)
                .end(done);
        });

        it('DELETE should remove an admin user', function(done) {
            authenticatedAgent
                .delete('/api/project/group/' + testData.group1._id + '/admin/' + testData.user2._id)
                .expect(200)
                .expect(function(res) {
                    expect(res.body.admins).to.not.include(testData.group1.admins[1]);
                })
                .end(done);
        });

        it('DELETE should not allow removal of the last admin', function(done) {
            authenticatedAgent
                .delete('/api/project/group/' + testData.group1._id + '/admin/' + testData.user._id)
                .expect(400)
                .end(done);
        });

    });
});

function initData(done) {
    var User = mongoose.model('ProjectUser');
    var Group = mongoose.model('Group');

    var testUser = new User({
        username: 'user',
        password: 'password',
    });

    var testUser2 = new User({
        username: 'user2', 
        password: 'password'
    });

    var group1 = new Group({
        name: 'group 1',
        admins: [ testUser._id ],
        visibility: 'PUBLIC'
    });
   
    var group2 = new Group({
        name: 'group 2',
        admins: [ testUser2._id ],
        members: [ testUser._id ],
        visibility: 'PRIVATE'
    });

    var group3 = new Group({
        name: 'group 3',
        admins: [ testUser._id ],
        visibility: 'PUBLIC'
    });

    testUser.groups = [ group1._id, group2._id, group3._id ];
    testUser2.groups = [ group2._id ];

    testUser.save(function(err, user) {
        if (err) return done(err);

        testData.user = user;
       
        testUser2.save(function(err, user) {
            if (err) return done(err);
            testData.user2 = user;
            
            group1.save(function(err, group) {
                if (err) return done(err);
                testData.group1 = group;
                
                group2.save(function(err, group) {
                    if (err) return done(err);
                    testData.group2 = group;
                    
                    group3.save(function(err, group) {
                        if (err) return done(err);   
                        testData.group3 = group;
                        done();
                    });
                });
            });
        });
    });
}

