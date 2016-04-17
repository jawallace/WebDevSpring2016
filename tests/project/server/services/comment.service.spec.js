var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('./test-app.js');

var authenticatedAgent;

var login = function(done) {
    authenticatedAgent = request.agent(app);

    authenticatedAgent 
        .post('/api/project/login')
        .send({ username: 'jeff', password: 'jeff'})
        .end(done);
};


