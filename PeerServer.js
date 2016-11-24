var ip = require('ip');
var moment = require('moment');     // manipulate, validate date time
var PeerServer = require('peer').PeerServer;

var port = 443;
var server = new PeerServer({ port: port, allow_discovery: true });
var connected = [];

// Connect & Disconnect Events will trigger when new user logged in to this sever
server.on('connection', function(id) {
    //# id is correct (a string)
    var idx = getObjectIndex(id); //connected.indexOf(id);
    if (idx === -1) {
        addPeer(id, "");
    }
    console.log('new connection with id ' + id + ' @ '  + moment().format('MMMM Do YYYY, h:mm:ss A'));
    //console.log("connection with empty name" + connected);
});


server.on('disconnect', function(id) {
    var idx = getObjectIndex(id);
    // console.log("disconnected id" + id);
    // console.log("disconnected " + idx);
    if (idx !== -1) { connected.splice(idx, 1); }
    console.log('disconnect with id ' + id + ' @ ' + moment().format('MMMM Do YYYY, h:mm:ss A'));
});

//returns connected-peoples collections as a response to the client request
server.get('/showall', function(req, res) {
    return res.json(connected);
});

//updates user's information to the collection
server.get('/set', function(req, res) {

    if (req.query.user == null) { return null; }
    var idx = getObjectIndex(req.query.id);
    addPeer(req.query.id, req.query.user);
    console.log(connected);
    return res.json(connected);
});

Array.prototype.findByValueOfObject = function(key, value) {
    return this.filter(function(item) {
        return (item[key] === value);
    });
}

function getObjectIndex(value) {                // need to look some other alternatives to pick appropriate index without looping
    //connected.map(function (e) { return e.id; }).indexOf(value);
    for (var i = 0; i < connected.length; i++) {
        if (connected[i]["id"] == value) {
            return i;
        }
    }
}

function addPeer(id, name) {
    if (getObjectIndex(id) !== -1) {
        var connTemp = {
            "id": id, "name": name
        };
        connected.push(connTemp);
    }
}

// Main
console.log('Peer Server running on ' +
  ip.address() + ':' + port ) ;
 console.log('Started @ ' + moment().format('MMMM Do YYYY, h:mm:ss A'));

