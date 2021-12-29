const express = require("express")
const http = require("http");

const router = require('./router.js');
const { addUser, removeUser, getUser, getUsersInRoom } = require("./user.js");

const io = require('socket.io')(8900, {
  cors:{
      origin: 'http://localhost:3000'
  }
})


const PORT = process.env.PORT || 6000;
const app = express();
const server = http.createServer(app)
app.use(router)




io.on("connection", (socket)=>{
  console.log("We have a new connection!!");

  socket.on("join", (info, callback)=>{
    const {name, room} = info
    const {error, user} = addUser({id:socket.id, name, room})

    if (error) return callback(error)

    socket.emit("message", {user: 'admin', text: `${user.name}, welcome to the room ${user.room}`})

    socket.broadcast.to(user.room).emit("message", {user: 'admin', text: `${user.name}, has joined`})
    socket.join(user.room)

    io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
    callback()

  })


  socket.on("sendMessage", (message, callback)=>{
    const user = getUser(socket.id)
    io.to(user.room).emit("message", {user: user.name, text: message})

    io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

    callback()
  })

  socket.on("disconnect", ()=>{
    const user = removeUser(socket.id)
    
    if (user) {
      io.to(user.room).emit("message", {user: 'admin', text: `${user.name} has left`})
    }
  
  })
})





server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}`))