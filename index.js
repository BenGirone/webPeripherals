const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const robot = require('robotjs');

app.get('/lib/socket.io.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'node_modules/socket.io-client/dist/socket.io.slim.js'));
});

app.use('/', express.static('public'));

let mousePos = robot.getMousePos();
robot.setMouseDelay(0.5);

io.on('connection', (socket) => {
    socket.on('key', (key) => {
        if (key.length === 1) {
            robot.typeString(key);
        } else if (key === 'Backspace') {
            // robot keys: https://robotjs.io/docs/syntax#keys
            robot.keyTap('backspace');
        } else if (key === 'Enter') {
            robot.keyTap('enter');
        }
        
        console.log(key);
    });

    socket.on('touchPadPos', (pos) => {
        mouse_pos = robot.getMousePos();
        robot.moveMouseSmooth((mouse_pos.x > pos.x) ? (mouse_pos.x - pos.x) : 0, (mouse_pos.y > pos.y) ? (mouse_pos.y - pos.y) : 0);
    });

    socket.on('click', (type) => {
        robot.mouseClick(type);
    });

    socket.on('scrollPos', (amount) => {
        robot.scrollMouse(0, amount);
    });

    socket.on('clear', (amount) => {
        robot.keyTap('a', 'control');
        robot.keyTap('backspace');
    });
});

server.listen(8080);

// vanilla keys
// Escape
// F1
// Tab
// NumLock
// CapsLock
// Shift
// Control
// Meta
// Alt
// ContextMenu
// Enter
// Backspace
// ScrollLock
// Pause
// PageUp
// Home
// Insert
// End
// Delete
// PageDown

// app.use("/nipplejs", express.static(__dirname + '/node_modules/nipplejs/dist'));

// socket.on('mousePos', function(pos){
//     mouse_pos = robot.getMousePos();

//     move_pos =  {x: pos.r * Math.cos(pos.theta), y: pos.r * Math.sin(pos.theta)};
//     //callMainAsync({function: 'log', data:'Mouse Position: ' + JSON.stringify(pos)});
// });

// socket.on('mouseClick', function(click){
//     robot.mouseClick(click.type);
//     //callMainAsync({function: 'log', data:'Mouse Click: ' + JSON.stringify(click)});
// });

// socket.on('scrollPos', function(pos){
//     robot.scrollMouse(0, pos.r);
//     //callMainAsync({function: 'log', data:'Mouse Scroll: ' + JSON.stringify(pos)});
// });