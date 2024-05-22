import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from 'cors';

const app = express();
const port = 8000;

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173/",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(cors({
    origin: "http://localhost:5173/",
    methods: ["GET", "POST"],
    credentials: true,
}));

app.get('/',(req, res) => {
    res.send("HEllooooooo");
})

io.on("connection", (socket) =>{
    console.log("USER CONNECTED");
    console.log("ID",socket.id);
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

