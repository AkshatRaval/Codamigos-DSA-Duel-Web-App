import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http';
import RoomRoutes from './routes/RoomRoute.js';
import judgeRoute from './routes/JudgeRoutes.js';
import userRoutes from './routes/UserRoutes.js';

// Constants
const PORT = process.env.PORT || 4000;


const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
//Routes
app.get("/", (req, res) => {
    res.send("Backend OK ✅");
});

app.use('/api/rooms', RoomRoutes)
app.use('/api/judge0', judgeRoute)
app.use('/api/users', userRoutes)
//Socket.io
io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    socket.on("create-room", (data) => {
        console.log("Got from client: " + data + " Socket-ID " + socket.id);
        socket.broadcast.emit("recive_code", (data))
    });
});



//Listen
server.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});