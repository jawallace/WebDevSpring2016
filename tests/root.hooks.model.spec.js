var mongoose = require('mongoose');
var mockgoose = require('mockgoose');

before(function(done) {
    mockgoose(mongoose);
    mongoose.connect('mongodb://localhost/cs4550');
    done();
});

after(function(done) {
    mockgoose.reset();
    mongoose.connection.close();
    done();
});
