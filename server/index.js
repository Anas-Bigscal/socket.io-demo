import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const port = 8000;
const secretKeyJWT = "madrid";
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

app.get("/login",(req, res) => {
    const token = jwt.sign({_id: "elCapitan"},secretKeyJWT);
    res.cookie("token",token,{httpOnly:true, secure:true, sameSite:"none"}).json({message: "LOGIN SUCCESS"});
});

// const user = false;
io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
        
        if (err) return next(err);

        const token = socket.request.cookies.token;

        if(!token) return next(new Error("Authentication Error"));

        const decoded = jwt.verify(token, secretKeyJWT);

        // if(!decoded) return next(new Error("Authentication Error"));
        next();

    });
    // if (user) next();
})

io.on("connection", (socket) =>{
    console.log("USER CONNECTED",socket.id);
    // console.log("ID",socket.id);
    // socket.emit("WELCOME",`WELCOME TO THE DEATH`);
    // socket.broadcast.emit("WELCOME",`${socket.id} will face DEATH`);
    socket.on("message", ({room, message})=>{
        console.log({room, message});
        socket.to(room).emit("receive-message",message);
        // socket.to(room).emit("receive-message",message);
    });

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
    });

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

