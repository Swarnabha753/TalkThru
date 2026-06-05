// import { createClient } from "redis";
// 
// const redisClient = createClient({
//     url: process.env.REDIS_URL,
// });
// 
// redisClient.on("error", (err) => {
//     console.log("Redis Error:", err);
// });
// 
// export const connectRedis = async () => {
//     try {
//         await redisClient.connect();
//         console.log("Redis Connected");
//     } catch (error) {
//         console.log("Redis Connection Failed:", error);
//     }
// };
// 
// export default redisClient;

import { createClient } from "redis";

export const pubClient = createClient({
    url: process.env.REDIS_URL,
});

export const subClient = pubClient.duplicate();

pubClient.on("error", (err) => {
    console.log("Redis Pub Error:", err);
});

subClient.on("error", (err) => {
    console.log("Redis Sub Error:", err);
});

export const connectRedis = async () => {
    await pubClient.connect();
    await subClient.connect();

    console.log("Redis Connected");
};

export default pubClient;
