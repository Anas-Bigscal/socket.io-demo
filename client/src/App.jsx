import React,{ useEffect, useMemo, useState }  from 'react';
import {io} from 'socket.io-client';
import {Button, Container, TextField, Typography} from '@mui/material';

const App = () => {

  // const socket = io("http://localhost:8000/");
  const socket = useMemo(()=> io("http://localhost:8000/"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {message, room});
    setMessage("");
  }

  useEffect(()=>{
    socket.on("connect", ()=>{
      setSocketId(socket.id);
      console.log("CONNECTED CLIENT",socket.id);
     });

     socket.on("receive-message", (data) =>{
      console.log("MESSAGE RECEIVED ===>>",data);
     });

     socket.on("WELCOME", (s)=>{
      console.log(s);
     });

     return () => {
      socket.disconnect();
     }
  },[])

  return <Container maxWidth="sm">
    <Typography variant='h1' component="div" gutterBottom>
      Welcome to socket.io
    </Typography>

    <Typography variant='h5' component="div" gutterBottom>
      {socketId}
    </Typography>

    <form onSubmit={handleSubmit}>
      <TextField value={message} onChange={e => setMessage(e.target.value)} id="outlined-basic" label="Message" variant='outlined'/>
      <TextField value={room} onChange={e => setRoom(e.target.value)} id="outlined-basic" label="Room" variant='outlined'/>
      <Button type="submit" variant='contained' color='primary'>Send</Button>
    </form>
  </Container>
}

export default App