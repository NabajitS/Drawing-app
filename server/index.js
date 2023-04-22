const express = require("express");
const app = express();
const http = require("http");
const {Server} = require("socket.io")

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    console.log(username.length)
    if (!username || username.length < 2) {
        return next(new Error("invalid username"));
    }
    socket.username = username;
    next();
})

app.get('/', (req, res) => {
    res.send('<h1>Helo  there</h1>');
});
  
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    const users=[];
    //Upon connection, we send all existing users to the client
    for (let [id, socket] of io.of("/").sockets ){
        users.push( {
                userID: id,
                username: socket.username,
            } )
    }
    socket.emit("users", users);

    //Notify all existing users(avoid sending the whole array of users each time, just sending the newly joined user object)
    socket.broadcast.emit("new user connected", {
        userID: socket.id,
        username: socket.username,
      });

    socket.on('shapes changed client', (arg) => {
        // io.emit('shapes changed server', arg);
        socket.broadcast.emit("shapes changed server", arg);
    })

    socket.on('paths changed client', (arg) => {
        socket.broadcast.emit("paths changed server", arg);
        // socket.broadcast.emit("paths changed", arg);
    })
});
  

server.listen(8000, () => {
    console.log('listening on *:8000');
});