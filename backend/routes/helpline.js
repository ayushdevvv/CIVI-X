import { Router } from "express";
import {
  getOrCreateConversation,
  getConversation,
  addUserMessage,
  listConversations,
  addAdminMessage,
  updateConversationStatus,
} from "../controllers/helplineController.js";

const router = Router();

router.post("/conversations", getOrCreateConversation);
router.get("/conversations/:id", getConversation);
router.post("/conversations/:id/messages", addUserMessage);

router.get("/admin/conversations", listConversations);
router.post("/admin/conversations/:id/messages", addAdminMessage);
router.patch("/admin/conversations/:id/status", updateConversationStatus);

export default router;
