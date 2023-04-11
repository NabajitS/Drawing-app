import { useEffect, useState } from "react"
import Canvas from "./Canvas"
// import {io} from "socket.io-client";
// const ENDPOINT = "http://localhost:8000";
// import { socket } from "./socket"

// const socket = io();

//init the connection

function App() {

  const [inputV, setInputV] = useState('');
  const [dd, setDD] = useState('apple')
  // const [socket, setSocket] = useState<null | any>(null);

  // useEffect( () => {
  //   setSocket(io("http://localhost:8000/"));
  // }, [])

  // useEffect(() => {
  //   if(!socket) return;
  //   socket.on('connect', () => {
  //     // console.log("Socket connected in the frontend")
  //     socket.on('welcome', (data: any) => {
  //       console.log('msg from server', data)
  //     })
  //   })

  //   // socket.on('chat', (data: any) => {
  //   //   console.log(data)
  //   //   setDD(data)
  //   // })
  // }, [socket]);

  // const handleSubmit = (e: any) => {
  //   e.preventDefault();
  //   if(inputV && socket){
  //     socket.emit('chat', inputV);
  //   }
  // }


  return (
    <div className="App">
      <Canvas />

      <form >
        <input onChange={(e) => setInputV(e.target.value)} type="text" />
        <button type="submit" >submit</button>
      </form>
      <h2>{dd}</h2>
    </div>
  )
}

export default App
