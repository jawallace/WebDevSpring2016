var app = require('./app.js');

var IP_ADDRESS = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var PORT = process.env.OPENSHIFT_NODEJS_PORT || 3000;

// Kick off Express server
app.listen(PORT, IP_ADDRESS);

