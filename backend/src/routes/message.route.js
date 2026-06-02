import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    getUsersForSidebar,
    getMessages,
    sendMessage,
    getUnreadCount,
    getAllUnreadCounts,
    getLastSeen,
} from "../controllers/message.controller.js";



const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);

router.get("/unread", protectRoute,getAllUnreadCounts);

router.get("/unread/:senderId", protectRoute, getUnreadCount);

router.get("/last-seen/:id", protectRoute, getLastSeen);

router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;