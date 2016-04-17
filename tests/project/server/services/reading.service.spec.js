var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('./test-app.js');
var mockgoose = require('mockgoose');
var mongoose = require('mongoose');

var user1;
var user2;

var testData = {
    user1: undefined,
    user2: undefined,
    group: undefined,
    reading: undefined
};

describe('ReadingService', function() {
    after('ReadingServiceTest resetDb', resetDb);
    
    before('ReadingServiceTest initData', initData);
        
    before('ReadingServiceTest login', login);

    describe('/api/project/group/:groupId/reading', function() {
        
        it('GET should return all readings', function(done) {
            request(app)
                .get('/api/project/group/' + testData.group._id + '/reading')
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.have.lengthOf(1);
                    expect(res.body[0]._id).to.equal(testData.reading._id.toString());
                    expect(res.body[0].book).to.equal(testData.reading.book);
                })
                .end(done);
        });

        it('POST should return 401 for an unauthenticated user', function(done) {
            request(app)
                .post('/api/project/group/' + testData.group._id + '/reading')
                .send({ book: '123456', endDate: new Date(Date.now() + 1000000) })
                .expect(401)
                .end(done);
        });

        it('POST should return 403 for a non-admin user', function(done) {
            user2
                .post('/api/project/group/' + testData.group._id + '/reading')
                .send({ book: '123456', endDate: new Date(Date.now() + 1000000) })
                .expect(403)
                .end(done);
        });

        it('POST should allow an admin to add a new reading', function(done) {
            user1
                .post('/api/project/group/' + testData.group._id + '/reading')
                .send({ book: '123456', endDate: new Date(Date.now() + 1000000) })
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.exist;
                    expect(res.body.book).to.equal('123456');
                })
                .end(done);
        });
    });

    describe('/api/project/group/:groupId/reading/:readingId', function() {
        
        it('GET should return a specific reading', function(done) {
            request(app)
                .get('/api/project/group/' + testData.group._id + '/reading/' + testData.reading._id)
                .expect(200)
                .expect(function(res) {
                    expect(res.body._id).to.equal(testData.reading._id.toString());
                })
                .end(done);
        });

        it('GET should return 404 for a non-existent reading', function(done) {
            request(app)
                .get('/api/project/group/' + testData.group._id + '/reading/' + mongoose.Types.ObjectId().toString())
                .expect(404)
                .end(done);
        });

        it('PUT should return 401 on a non-authenticated user', function(done) {
            request(app)
                .put('/api/project/group/' + testData.group._id + '/reading/' + testData.reading._id)
                .send({ book: '23456' })
                .expect(401)
                .end(done);
        });

        it('PUT should return 403 for a non-admin user', function(done) {
            user2
                .put('/api/project/group/' + testData.group._id + '/reading/' + testData.reading._id)
                .send({ book: '23456' })
                .expect(403)
                .end(done);
        });

        it('PUT should allow an admin user to update the reading', function(done) {
            user1
                .put('/api/project/group/' + testData.group._id + '/reading/' + testData.reading._id)
                .send({ book: '23456' })
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.exist;
                    expect(res.body.book).to.equal('23456');
                })
                .end(done);
        });

        it('DELETE should return 401 for a non-authenticated user', function(done) {
            request(app)
                .delete('/api/project/group/' + testData.group._id + '/reading/' + testData.reading._id)
                .expect(401)
                .end(done);
        });

        it('DELETE should return 403 for a non-admin user', function(done) {
            user2
                .delete('/api/project/group/' + testData.group._id + '/reading/' + testData.reading._id)
                .expect(403)
                .end(done);
        });

        it('DELETE should allow an admin user to remove a reading', function(done) {
            user1
                .delete('/api/project/group/' + testData.group._id + '/reading/' + testData.reading._id)
                .expect(200)
                .end(done);
        });

    });
});

function initData(done) {
    var User = mongoose.model('ProjectUser');
    var Group = mongoose.model('Group');
    var Reading = mongoose.model('Reading');

    var _user1 = new User({
        username: 'user1',
        password: 'password'
    });

    var _user2 = new User({
        username: 'user2', 
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

    _user1.groups = [ _group._id ];
    _user2.groups = [ _group._id ];

    _user1.save(function(err, user) {
        if (err) return done(err);
        testData.user1 = user;

        _user2.save(function(err, user) {
            if (err) return done(err);
            testData.user2 = user;

            _group.save(function(err, group) {
                if (err) return done(err);
                testData.group = group;

                _reading.save(function(err, reading) {
                    if (err) return done(err);
                    testData.reading = reading;
                    
                    done();
                });
            });
        });
    });
}

function login(done) {
    user1 = request.agent(app);
    user2 = request.agent(app);

    user1 
        .post('/api/project/login')
        .send({ username: testData.user1.username, password: 'password' })
        .end(function() {
            user2 
                .post('/api/project/login')
                .send({ username: testData.user2.username, password: 'password' })
                .end(done);
        });
}

function resetDb(done) {
    mockgoose.reset(done);    
}
