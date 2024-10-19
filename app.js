const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000
const path = require('path')
const server = app.listen(PORT, ()=>console.log(`Server Running on Port : ${PORT}`))
const io = require('socket.io')(server)


// initialise a set to store connected socket ids
let socketsConnected = new Set()

//make public folder static path
app.use(express.static(path.join(__dirname,'public')))

//listen the connection event from socket server to justify socket is connected
io.on('connection', onConnected)

function onConnected(socket){
    console.log(socket.id)
    socketsConnected.add(socket.id) // add sockets to socket set when connected

    io.emit('total-user', socketsConnected.size) // emit an event named total-user to get total connected user on clint side 

    socket.on('disconnect',()=>{
        console.log('Socket Disconnected:', socket.id)
        socketsConnected.delete(socket.id) // delete sockets from socket set when dis-connected

        io.emit('total-user', socketsConnected.size) // emit an event named total-user to get total connected user at currently 

    })

    socket.on('messageSend' , (data)=>{
        console.log(data)
        socket.broadcast.emit('chat-msg-event' , data)
    })

    socket.on('feedback_event', (data)=>{
        socket.broadcast.emit('typing-feedback', data)
    })
}