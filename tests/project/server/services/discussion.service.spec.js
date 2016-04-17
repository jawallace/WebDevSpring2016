var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('./test-app.js');
var mockgoose = require('mockgoose');
var mongoose = require('mongoose');

var user1;
var user2;
var user3;

var testData = {
    user1: undefined,
    user2: undefined,
    user3: undefined,
    group: undefined,
    reading: undefined,
    discussion1: undefined,
    discussion2: undefined,
    readingUrl: undefined
};

describe('DiscussionService', function() {
    after('DiscussionServiceTest resetDb', resetDb);
    
    before('DiscussionServiceTest initData', initData);
        
    before('DiscussionServiceTest login', login);

    describe('/api/project/group/:groupId/reading/:readingId/discussion', function() {
        
        it('GET should return all discussions for the reading, most recent first.', function(done) {
            request(app)
                .get(testData.readingUrl + '/discussion')
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.have.lengthOf(2);
                    expect(res.body[0].topic).to.equal(testData.discussion2.topic);
                    expect(res.body[1].topic).to.equal(testData.discussion1.topic);
                })
                .end(done);
        });

        it('POST should return 401 for an unauthorized user', function(done) {
            request(app)
                .post(testData.readingUrl + '/discussion')
                .send({ topic: 'a new topic' })
                .expect(401)
                .end(done);
        });

        it('POST should return 403 for a non-group member', function(done) {
            user3 
                .post(testData.readingUrl + '/discussion')
                .send({ topic: 'a new topic' })
                .expect(403)
                .end(done);
        });

        it('POST should let a group member create a discussion', function(done) {
            user2
                .post(testData.readingUrl + '/discussion')
                .send({ topic: 'user2s topic' })
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.exist;
                    expect(res.body.topic).to.equal('user2s topic');
                })
                .end(done);
        });
        
        it('POST should let a group admin create a discussion', function(done) {
            user1
                .post(testData.readingUrl + '/discussion')
                .send({ topic: 'user1s topic' })
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.exist;
                    expect(res.body.topic).to.equal('user1s topic');
                })
                .end(done);
        });
    });

    describe('/api/project/group/:groupId/reading/:readingId/discussion/:discussionId', function() {
        
        it('GET should return 404 for a nonexistent discussion', function(done) {
            request(app)
                .get(testData.readingUrl + '/discussion/' + mongoose.Types.ObjectId())
                .expect(404)
                .end(done);
        });

        it('GET should return the discussion', function(done) {
            request(app)
                .get(testData.readingUrl + '/discussion/' + testData.discussion1._id)
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.exist;
                    expect(res.body._id).to.equal(testData.discussion1._id.toString());
                })
                .end(done);
        });

        it('PUT should return 401 for a non-authenticated user', function(done) {
            request(app)
                .put(testData.readingUrl + '/discussion/' + testData.discussion1._id)
                .send({ topic: 'new topic' })
                .expect(401)
                .end(done);
        });

        it('PUT should return 403 for a non-group member', function(done) {
            user3
                .put(testData.readingUrl + '/discussion/' + testData.discussion1._id)
                .send({ topic: 'new topic' })
                .expect(403)
                .end(done);
        });

        it('PUT should return 403 for a non-admin user who is not editing their own discussion', function(done) {
            user2
                .put(testData.readingUrl + '/discussion/' + testData.discussion1._id)
                .send({ topic: 'new topic' })
                .expect(403)
                .end(done);
        });

        it('PUT should allow an admin to update any discussion in the reading', function(done) {
            user1
                .put(testData.readingUrl + '/discussion/' + testData.discussion2._id)
                .send({ topic: 'new topic' })
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.exist;
                    expect(res.body.topic).to.equal('new topic');
                })
                .end(done);
        });

        it('PUT should allow a user to update their own discussion', function(done) {
            user2
                .put(testData.readingUrl + '/discussion/' + testData.discussion2._id)
                .send({ topic: 'new new topic' })
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.exist;
                    expect(res.body.topic).to.equal('new new topic');
                })
                .end(done);
        });
        
        it('DELETE should return 401 for a non-authenticated user', function(done) {
            request(app)
                .delete(testData.readingUrl + '/discussion/' + testData.discussion1._id)
                .expect(401)
                .end(done);
        });

        it('DELETE should return 403 for a non-group member', function(done) {
            user3
                .delete(testData.readingUrl + '/discussion/' + testData.discussion1._id)
                .expect(403)
                .end(done);
        });

        it('DELETE should return 403 for a non-admin user who is not deleteing their own discussion', function(done) {
            user2
                .delete(testData.readingUrl + '/discussion/' + testData.discussion1._id)
                .expect(403)
                .end(done);
        });

        it('DELETE should allow an admin to remove any discussion in the reading', function(done) {
            user1
                .delete(testData.readingUrl + '/discussion/' + testData.discussion2._id)
                .expect(200)
                .end(done);
        });

        it('DELETE should allow a user to remove their own discussion', function(done) {
            user1
                .delete(testData.readingUrl + '/discussion/' + testData.discussion1._id)
                .expect(200)
                .end(done);
        });
    });
});

function initData(done) {
    var User = mongoose.model('ProjectUser');
    var Group = mongoose.model('Group');
    var Reading = mongoose.model('Reading');
    var Discussion = mongoose.model('Discussion');

    var _user1 = new User({
        username: 'user1',
        password: 'password'
    });

    var _user2 = new User({
        username: 'user2', 
        password: 'password'
    });

    var _user3 = new User({
        username: 'user3', 
        password: 'password'
    });

    var _group = new Group({
        name: 'group',
        admins: [ _user1._id ],
        members: [ _user2._id ],
        visibility: 'PUBLIC'
    });

    var _reading = new Reading({
        book: '12345',
        endDate: new Date(Date.now() + 100000),
        group: _group._id
    });

    var _discussion1 = new Discussion({
        topic: 'first discussion',
        user: _user1._id,
        reading: _reading._id,
        posted: new Date()
    });
    
    var _discussion2 = new Discussion({
        topic: 'second discussion',
        user: _user2._id,
        reading: _reading._id,
        posted: new Date(Date.now() + 1000000)
    });

    _user1.groups = [ _group._id ];
    _user2.groups = [ _group._id ];
    _user3.groups = [ ];

    _user1.save(function(err, user) {
        if (err) return done(err);
        testData.user1 = user;

        _user2.save(function(err, user) {
            if (err) return done(err);
            testData.user2 = user;
            
            _user3.save(function(err, user) {
                if (err) return done(err);
                testData.user3 = user;
                
                _group.save(function(err, group) {
                    if (err) return done(err);
                    testData.group = group;

                    _reading.save(function(err, reading) {
                        if (err) return done(err);
                        testData.reading = reading;
                        
                        _discussion1.save(function(err, discussion) {
                            if (err) return done(err);
                            testData.discussion1 = discussion;
                            
                            _discussion2.save(function(err, discussion) {
                                if (err) return done(err);
                                testData.discussion2 = discussion;

                                testData.readingUrl = '/api/project/group/' + _group._id + '/reading/' + _reading._id;
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
}

function login(done) {
    user1 = request.agent(app);
    user2 = request.agent(app);
    user3 = request.agent(app);

    user1 
        .post('/api/project/login')
        .send({ username: testData.user1.username, password: 'password' })
        .end(function() {
            user2 
                .post('/api/project/login')
                .send({ username: testData.user2.username, password: 'password' })
                .end(function() {
                    user3
                        .post('/api/project/login')
                        .send({ username: testData.user3.username, password: 'password' })
                        .end(done); 
                });
        });
}

function resetDb(done) {
    mockgoose.reset(done);    
}
