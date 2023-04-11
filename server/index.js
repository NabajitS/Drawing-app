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

// app.use(cors())

app.get('/', (req, res) => {
    res.send('<h1>Helo  there</h1>');
});
  
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.emit("welcome", "WELCOME TO THE CHANNEL")


    // socket.on('chat', (arg) => {
    //     console.log(arg)
    //     io.emit('chat',  arg)
    // })

    // socket.on('client req', () => {
    //     console.log("client request")
    //     socket.broadcast.emit('message', "this is a test from server");
    // })

    socket.on("nigga bitch", (arg) => {
        console.log(arg)
    })

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