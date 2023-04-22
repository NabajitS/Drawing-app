import { useEffect, useState } from "react"
import Canvas from "./Canvas"
import { socket } from "./socket"


function App() {
  const [usernameSelected, setUsernameSelected] = useState(false);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([])
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

  const handleUsername = (e: any) => {
    e.preventDefault();
    if (username.length < 2) {
      return
    }
    setUsernameSelected(true);
    socket.auth = { username: username };
    socket.connect();
  }

  useEffect(() => {
    function setTotalUsers(data: any) {
      setUsers(data)
    }

    function setNewUser(data: any) {
      setUsers((prev: any) => prev ? [data, ...prev] : data)
    }

    //Handle username error i.e empty username
    socket.on("connect_error", (err) => {
      setUsernameSelected(false); // prints the message associated with the error
      console.log(err)
    });


    socket.on("users", setTotalUsers)
    socket.on("new user connected", setNewUser)

    return () => {
      socket.off('users', setTotalUsers);
      socket.off('new user connected', setNewUser);
    }

  }, [socket])

  return (
    <div className="App">

      {
        usernameSelected ? <Canvas /> : (
          <div>
            <form onSubmit={(e) => handleUsername(e)} >
              <label>Enter Username</label>
              <input onChange={(e: any) => setUsername(e.target.value)} value={username} type="text" />
              <button type="submit">submit</button>
            </form>
          </div>
        )
      }

      <div>
        {
          users.map((user: any) => (
            <h3>{user.username}</h3>
          ))
        }
      </div>


      {/* <form >
        <input onChange={(e) => setInputV(e.target.value)} type="text" />
        <button type="submit" >submit</button>
      </form>
      <h2>{dd}</h2> */}
    </div>
  )
}

export default App
