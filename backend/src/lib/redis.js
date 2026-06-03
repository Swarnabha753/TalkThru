import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
    console.log("Redis Error:", err);
});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Redis Connected");
    } catch (error) {
        console.log("Redis Connection Failed:", error);
    }
};

export default redisClient;