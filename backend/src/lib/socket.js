import { Server } from "socket.io";
import http from "http";
import express from "express";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "./redis.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {origin: ["http://localhost:5173"]},
});

io.adapter(createAdapter(pubClient, subClient));

console.log("Redis Adapter Enabled");

export async function getReceiverSocketId(userId) {
    return await pubClient.hGet("onlineUsers", userId);
}

io.on("connection", async (socket) => {
    try {
        console.log("A user connected",socket.id);
        const userId = socket.handshake.query.userId;

        if (userId) {
            await pubClient.hSet("onlineUsers", userId.toString(), socket.id);
        }

        const onlineUsers = await pubClient.hKeys("onlineUsers");

        io.emit("getOnlineUsers", onlineUsers);

        socket.on("disconnect",async () => {
                try {
                    console.log("A user disconnected", socket.id);
                    if (userId) {
                        await pubClient.set(`lastSeen:${userId}`,Date.now());
                        await pubClient.hDel("onlineUsers",userId.toString());
                    }
                    const onlineUsers = await pubClient.hKeys("onlineUsers");

                    io.emit("getOnlineUsers",onlineUsers);
                } catch (error) {
                    console.log("Disconnect Error:",error.message);
                }
            }
        );
    } catch (error) {
        console.log("Socket Connection Error:",error.message);
    }
});

export { io, app, server };