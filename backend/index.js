const http = require('http')
const app = require('./src/config/express.config')
const { Server } = require("socket.io")


const server = http.createServer(app)

const io = new Server(server, {
    cors: "*"
})

io.on("connection", (socket) => {
    console.log("SOCKET CONNECTED::", socket.id)
    socket.on("new-message", (data) => {
        console.log(data)
        socket.emit("message-received", data)
    })
})

server.listen(3003, '127.0.0.1', (err) => {
    if(!err){
        console.log('I am running on port 3003')
        console.log('Press CTRL+C To end server')
    }
})