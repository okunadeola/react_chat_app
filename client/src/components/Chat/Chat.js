import { useState, useEffect } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
import './Chat.css'
import InfoBar from '../Infobar/InfoBar';
import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import TextContainer from '../TextContainer/TextContainer';
import {useHistory} from 'react-router-dom'

let socket;
const Chat = ({ location }) => {
  const [name, setName] = useState("")
  const [room, setRoom] = useState("")
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState([])
  const ENDPOINT ='ws://localhost:8900'
  const history = useHistory()

  useEffect(() => {
    const { room, name } = queryString.parse(location.search)
    socket = io(ENDPOINT);

    setName(name)
    setRoom(room)
    
    socket.emit("join", {name, room}, (error)=>{
      if (error) {
        alert(error) 
        history.push('/') 
      }
    })

    return ()=>{

      socket.off();
    }

  }, [ENDPOINT, location.search ])


  useEffect(() => {
    socket.on('message', (message)=>{
      setMessages([...messages, message])
    })

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [messages])

  const sendMessage = (e)=>{
    e.preventDefault()
    if (message) {
      socket.emit('sendMessage', message, ()=> setMessage(""))
    }
  }
console.log(messages);
  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  )
}

export default Chat
