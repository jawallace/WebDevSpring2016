var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('./test-app.js');
var mockgoose = require('mockgoose');

var authenticatedAgent;

function login(done) {
    authenticatedAgent = request.agent(app);

    authenticatedAgent 
        .post('/api/project/login')
        .send({ username: 'jeff', password: 'jeff'})
        .end(done);
}

function resetDb(done) {
    mockgoose.reset(done);    
}

describe('UserService', function() {
    after('UserService reset db', resetDb);
    
    describe('/api/project/user', function() {

        it('POST should create a user', function(done) {
            request(app)
                .post('/api/project/user')
                .send({ username: 'jeff', password: 'jeff' })
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.exist;
                    expect(res.body.username).to.equal('jeff');
                })
                .end(done);
        });

        it('GET should get all users', function(done) {
            request(app)
                .get('/api/project/user')
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.exist;
                    expect(res.body).to.have.lengthOf(1);
                    expect(res.body[0]).to.have.property('username');
                    expect(res.body[0].username).to.equal('jeff');
                })
                .end(done);
        });
    });

    describe('/api/project/login', function() {
        
        it('POST should login a user', function(done) {
            var agent = request.agent(app);
            agent
                .post('/api/project/login')
                .send({ username: 'jeff', password: 'jeff'})
                .expect(200)
                .expect(function(res) {
                    expect(res.body.username).to.equal('jeff');
                })
                .end(function(err) {
                    if (err) {
                        return done(err);
                    }

                    agent
                        .get('/api/project/loggedIn')
                        .expect(200)
                        .expect(function(res) {
                            expect(res.body.username).to.equal('jeff');
                        })
                        .end(done);
                });
        });

    });

    describe('/api/project/logout', function() {

        before('logout test login', login);

        it('POST should logout the user', function(done) {
            authenticatedAgent
                .post('/api/project/logout')
                .expect(200)
                .end(function(err) {
                    if (err) return done(err);

                    authenticatedAgent
                        .get('/api/project/loggedIn')
                        .expect(function(res) {
                            expect(res.body).to.be.false;
                        })
                        .end(done);
                });
        });

    });

    describe('/api/project/user/:id', function() {
        var id;
        var user1;
        
        before('/api/project/user/:id create user', function(done) {
            request(app)
                .post('/api/project/user')
                .send({ username: 'user1', password: 'foobar' })
                .end(function(err, res) {
                    if (err) return done(err);

                    id = res.body._id;
                    done();
                });
        });

        before('/api/project/user/:id login', login);

        before('/api/project/user/:id login2', function(done) {
            user1 = request.agent(app);
            user1 
                .post('/api/project/login')
                .send({ username: 'user1', password: 'foobar' })
                .end(done);
        });

        it('GET should return the user', function(done) {
            request(app)
                .get('/api/project/user/' + id.toString())
                .expect(200)
                .expect(function(res) {
                    expect(res.body.username).to.equal('user1');
                })
                .end(done);
        });

        it('PUT should not allow other users to modify the user', function(done) {
            authenticatedAgent
                .put('/api/project/user/' + id.toString())
                .send({ username: 'user2' })
                .expect(403)
                .end(done);
        });
        
        it('PUT should allow the user to modify itself', function(done) {
            user1
                .put('/api/project/user/' + id.toString())
                .send({ username: 'user2' })
                .expect(200)
                .expect(function(res) {
                    expect(res.body.username).to.equal('user2');
                })
                .end(done);
        });
        
        it('DELETE should not allow other users to delete the user', function(done) {
            authenticatedAgent
                .delete('/api/project/user/' + id.toString())
                .expect(403)
                .end(done);
        });
        
        it('DELETE should allow the user to delete itself', function(done) {
            user1
                .delete('/api/project/user/' + id.toString())
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);

                    request(app)
                        .get('/api/project/user/' + id.toString())
                        .expect(404)
                        .end(done);
                });
        });

    });

});
