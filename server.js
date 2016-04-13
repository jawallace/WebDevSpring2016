var mongoose = require('mongoose');

var connectionString = 'mongodb://localhost/cs4550';
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connectionString = 
        process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect(connectionString);

var app = require('./app.js')(mongoose);

var IP_ADDRESS = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var PORT = process.env.OPENSHIFT_NODEJS_PORT || 3000;

// Kick off Express server
app.listen(PORT, IP_ADDRESS);

