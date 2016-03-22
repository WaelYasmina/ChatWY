/*jslint nomen: true*/
/*global require,__dirname*/
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs'),
    path = require('path');
var connectedClients = ['empty'];
app.get('/', function (req, res) {
    'use strict';
    //console.log('Server is running ! :D');
    res.sendFile(__dirname + '/client.html');
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket) {
    'use strict';
    //socket.broadcast.emit('connected', 'A user is connected ! :D');
    
    
    socket.on('connected', function (sock) {
        connectedClients.push(sock);
        socket.join(sock);
        socket.broadcast.emit('connected', connectedClients);
    });
    
    socket.emit('connectedList', connectedClients);
    
    socket.on('private', function (sock) {
        io.to(sock.userTo).emit('private', sock);
        socket.emit('private', sock);
    });
    
    socket.on('message', function (sock) {
        socket.broadcast.emit('message', sock);
        socket.emit('message', sock);
    });
    
    socket.on('disconnected', function (sock) {
        socket.broadcast.emit('disconnected', sock);
        connectedClients.splice(connectedClients.indexOf(sock), connectedClients.indexOf(sock));
    });
    
    socket.on('sendIcon', function (sock) {
        socket.broadcast.emit('sendIcon', sock);
        socket.emit('sendIcon', sock);
    });
    
    socket.on('isTyping', function (sock) {
        socket.broadcast.emit('isTyping', sock);
    });
    
});

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

server.listen(port, ip);