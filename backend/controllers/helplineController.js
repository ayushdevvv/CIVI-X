import HelplineConversation from "../models/HelplineConversation.js";
import { generateConversationId } from "../utils/generateConversationId.js";

export async function getOrCreateConversation(req, res, next) {
  try {
    const { sessionId, name, contact } = req.body || {};
    if (!sessionId) return res.status(400).json({ message: "A session ID is required." });

    let conversation = await HelplineConversation.findOne({ sessionId }).sort({ updatedAt: -1 });
    if (!conversation) {
      conversation = await HelplineConversation.create({
        conversationId: generateConversationId(),
        sessionId,
        name: name?.trim() || "Citizen",
        contact: contact?.trim() || "",
        messages: [{ sender: "admin", text: "Hi! You’re connected to the Civi-X helpline. How can we help you today?" }],
      });
    } else {
      if (name?.trim()) conversation.name = name.trim();
      if (contact?.trim()) conversation.contact = contact.trim();
      await conversation.save();
    }

    res.json(conversation);
  } catch (err) {
    next(err);
  }
}

export async function getConversation(req, res, next) {
  try {
    const conversation = await HelplineConversation.findOne({ conversationId: req.params.id });
    if (!conversation) return res.status(404).json({ message: "Conversation not found." });
    res.json(conversation);
  } catch (err) {
    next(err);
  }
}

export async function addUserMessage(req, res, next) {
  try {
    const { sessionId, text } = req.body || {};
    if (!sessionId || !text?.trim()) return res.status(400).json({ message: "Message and session ID are required." });

    const conversation = await HelplineConversation.findOne({ conversationId: req.params.id, sessionId });
    if (!conversation) return res.status(404).json({ message: "Conversation not found." });
    if (conversation.status === "closed") return res.status(400).json({ message: "This conversation is closed." });

    conversation.messages.push({ sender: "user", text: text.trim() });
    conversation.lastMessageAt = new Date();
    await conversation.save();
    res.status(201).json(conversation);
  } catch (err) {
    next(err);
  }
}

export async function listConversations(req, res, next) {
  try {
    const items = await HelplineConversation.find().sort({ lastMessageAt: -1 }).limit(100).lean();
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function addAdminMessage(req, res, next) {
  try {
    const { text } = req.body || {};
    if (!text?.trim()) return res.status(400).json({ message: "Message is required." });

    const conversation = await HelplineConversation.findOne({ conversationId: req.params.id });
    if (!conversation) return res.status(404).json({ message: "Conversation not found." });

    conversation.messages.push({ sender: "admin", text: text.trim() });
    conversation.lastMessageAt = new Date();
    conversation.status = "open";
    await conversation.save();
    res.status(201).json(conversation);
  } catch (err) {
    next(err);
  }
}

export async function updateConversationStatus(req, res, next) {
  try {
    const { status } = req.body || {};
    if (!["open", "closed"].includes(status)) return res.status(400).json({ message: "Invalid status." });
    const conversation = await HelplineConversation.findOneAndUpdate(
      { conversationId: req.params.id },
      { status },
      { new: true }
    );
    if (!conversation) return res.status(404).json({ message: "Conversation not found." });
    res.json(conversation);
  } catch (err) {
    next(err);
  }
}
