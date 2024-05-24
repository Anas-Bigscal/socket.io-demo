import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from 'cors';

const port = 8000;
const app = express();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}));

app.get("/",(req, res) => {
    res.send("HEllooooooo");
});

io.on("connection", (socket) =>{
    console.log("USER CONNECTED",socket.id);
    // console.log("ID",socket.id);
    // socket.emit("WELCOME",`WELCOME TO THE DEATH`);
    // socket.broadcast.emit("WELCOME",`${socket.id} will face DEATH`);
    socket.on("message", ({room, message})=>{
        console.log({room, message});
        io.to(room).emit("receive-message",message);
    })
    socket.on("disconnect",()=>{
        console.log("USER Disconnected",socket.id);
    })
});

server.listen(port , () => {
    console.log(`SERVER RUNNING ${port}`);
});

// const wss = new WebSocketServer({server});

// wss.on("connection", (ws) => {
//     ws.on("message", (data) => {
//         console.log("Data from client: %s",data);
//         ws.send("Hala Madrid!!!");
//     })
// });

