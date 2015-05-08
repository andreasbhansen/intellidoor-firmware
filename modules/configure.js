var Asteroid = require('Asteroid');

var instanceURL = 'localhost:3000';
var con = new Asteroid(instanceURL);

con.on('connected', function ()
{
    console.log('Realtimer.js via Asteroid via DDP.js successfully connected to', instanceURL);
});

module.exports = {
    _connect: con
};