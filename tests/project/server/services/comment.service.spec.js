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
    discussion: undefined,
    comment1: undefined,
    comment2: undefined,
    discussionUrl: undefined
};

describe('CommentService', function() {
    after('CommentServiceTest resetDb', resetDb);
    
    before('CommentServiceTest initData', initData);
        
    before('CommentServiceTest login', login);

    describe('/api/project/group/:groupId/reading/:readingId/discussion/:discussionId/comment', function() {
        
        it('GET should return all comments for a discussion, oldest first', function(done) {
            request(app)
                .get(testData.discussionUrl + '/comment')
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.exist;
                    expect(res.body).to.have.lengthOf(2);
                    expect(res.body[0]._id).to.equal(testData.comment1._id.toString());
                    expect(res.body[1]._id).to.equal(testData.comment2._id.toString());
                })
                .end(done);
        });

        it('POST should return 401 for a non-authenticated user', function(done) {
            request(app)
                .post(testData.discussionUrl + '/comment')
                .send({ text: 'a new comment' })
                .expect(401)
                .end(done);
        });

        it('POST should return 403 for a non-group member', function(done) {
            user3
                .post(testData.discussionUrl + '/comment')
                .send({ text: 'a new comment' })
                .expect(403)
                .end(done);
        });

        it('POST should allow a group member to add a comment', function(done) {
            user2
                .post(testData.discussionUrl + '/comment')
                .send({ text: 'a new comment' })
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.exist;
                    expect(res.body.text).to.equal('a new comment')
                    expect(res.body.user).to.equal(testData.user2._id.toString());
                    expect(res.body.discussion).to.equal(testData.discussion._id.toString());
                })
                .end(done);
        });

        it('POST should allow a group admin to add a comment', function(done) {
            user1
                .post(testData.discussionUrl + '/comment')
                .send({ text: 'a new comment' })
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.exist;
                    expect(res.body.text).to.equal('a new comment')
                    expect(res.body.user).to.equal(testData.user1._id.toString());
                    expect(res.body.discussion).to.equal(testData.discussion._id.toString());
                })
                .end(done);
        });
    });
    
    describe('/api/project/group/:groupId/reading/:readingId/discussion/:discussionId/comment/:commentId', function() {
        
        it('GET should return 404 for a nonexistent comment', function(done) {
            request(app)
                .get(testData.discussionUrl + '/comment/' + mongoose.Types.ObjectId())
                .expect(404)
                .end(done);
        });

        it('GET should return the comment', function(done) {
            request(app)
                .get(testData.discussionUrl + '/comment/' + testData.comment1._id)
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.exist;
                    expect(res.body.text).to.equal(testData.comment1.text);
                    expect(res.body._id).to.equal(testData.comment1._id.toString());
                })
                .end(done);
        });

        it('PUT should return 401 for a non-authenticated user', function(done) {
            request(app)
                .put(testData.discussionUrl + '/comment/' + testData.comment1._id)
                .send({ text: 'new text' })
                .expect(401)
                .end(done);
        });

        it('PUT should return 403 for a non-group user', function(done) {
            user3
                .put(testData.discussionUrl + '/comment/' + testData.comment1._id)
                .send({ text: 'new text' })
                .expect(403)
                .end(done);
        });

        it('PUT should return 403 for a group member who tries to update another members comment', function(done) {
            user2
                .put(testData.discussionUrl + '/comment/' + testData.comment1._id)
                .send({ text: 'new text' })
                .expect(403)
                .end(done);
        });

        it('PUT should allow an admin to update any comment in the group', function(done) {
            user1
                .put(testData.discussionUrl + '/comment/' + testData.comment2._id)
                .send({ text: 'new text' })
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.exist;
                    expect(res.body.text).to.equal('new text');
                    expect(res.body.user).to.equal(testData.user2._id.toString());
                })
                .end(done);
        });

        it('PUT should allow a user to update their own comment', function(done) {
            user2
                .put(testData.discussionUrl + '/comment/' + testData.comment2._id)
                .send({ text: 'new new text' })
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.exist;
                    expect(res.body.text).to.equal('new new text');
                    expect(res.body.user).to.equal(testData.user2._id.toString());
                })
                .end(done);
        });
        
        it('DELETE should return 401 for a non-authenticated user', function(done) {
            request(app)
                .delete(testData.discussionUrl + '/comment/' + testData.comment1._id)
                .expect(401)
                .end(done);
        });

        it('DELETE should return 403 for a non-group user', function(done) {
            user3
                .delete(testData.discussionUrl + '/comment/' + testData.comment1._id)
                .expect(403)
                .end(done);
        });

        it('DELETE should return 403 for a group member who tries to remove another members comment', function(done) {
            user2
                .delete(testData.discussionUrl + '/comment/' + testData.comment1._id)
                .expect(403)
                .end(done);
        });

        it('DELETE should allow an admin to remove any comment in the group', function(done) {
            user1
                .delete(testData.discussionUrl + '/comment/' + testData.comment2._id)
                .expect(200)
                .end(done);
        });

        it('DELETE should allow a user to remove their own comment', function(done) {
            user1
                .delete(testData.discussionUrl + '/comment/' + testData.comment1._id)
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
    var Comment = mongoose.model('Comment');

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

    var _discussion = new Discussion({
        topic: 'first discussion',
        user: _user1._id,
        reading: _reading._id,
        posted: new Date()
    });
   
    var _comment1 = new Comment({
        user: _user1._id,
        text: 'Comment 1 text',
        discussion: _discussion._id,
        posted: new Date()
    });
    
    var _comment2 = new Comment({
        user: _user2._id,
        text: 'Comment 2 text',
        discussion: _discussion._id,
        posted: new Date(Date.now() + 100000)
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
                        
                        _discussion.save(function(err, discussion) {
                            if (err) return done(err);
                            testData.discussion = discussion;
                            testData.discussionUrl = '/api/project/group/' + _group._id + '/reading/' + _reading._id + '/discussion/' + _discussion._id;
                            
                            _comment1.save(function(err, comment) {
                                if (err) return done(err);
                                testData.comment1 = comment;
                            
                                _comment2.save(function(err, comment) {
                                    if (err) return done(err);
                                    testData.comment2 = comment;
                                
                                    done();
                                });
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
