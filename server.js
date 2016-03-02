
var express = require('express');

var app = express();

// Express Configuration
app.use(express.static(__dirname + '/public'));

var IP_ADDRESS = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var PORT = process.env.OPENSHIFT_NODEJS_PORT || 3000;

require('./public/project/server/app.js')(app);

// Kick off Express server
app.listen(PORT, IP_ADDRESS);

