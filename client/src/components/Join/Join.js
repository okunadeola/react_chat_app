import { useState } from 'react'
import {Link} from 'react-router-dom'

import './Join.css'

const Join = () => {
  const [name, setName] = useState("")
  const [room, setRoom] = useState("")

  return (
    <div className='joinOuterContainer'>
      <div className="joinInnerContainer">
        <div className="heading">Join</div>

        <div><input type="text" className='joinInput' placeholder='Name' onChange={(e)=>setName(e.target.value)} /></div>

        <div><input type="text" className='joinInput mt-20' placeholder='Room' onChange={(e)=>setRoom(e.target.value)} /></div>
      
        <Link onClick={e=> (!name || !room)? e.preventDefault(): null} to={`/chat?name=${name}&room=${room}`}>
          <button className='button mt-20' type='submit'>Sign In</button>
        </Link>
      </div>
    </div>
  )
}

export default Join
