var mongoose = require('mongoose');
var mockgoose = require('mockgoose');

before('start mockgoose', function(done) {
    mockgoose(mongoose);
    mongoose.connect('mongodb://localhost/cs4550');
    done();
});

after('clean mockgoose', function(done) {
    mockgoose.reset();
    mongoose.connection.close();
    done();
});
