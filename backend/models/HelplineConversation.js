import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ["user", "admin"], required: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    at: { type: Date, default: Date.now },
  },
  { _id: true }
);

const helplineConversationSchema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true, unique: true, index: true },
    sessionId: { type: String, required: true, index: true },
    name: { type: String, default: "Citizen", trim: true, maxlength: 80 },
    contact: { type: String, default: "", trim: true, maxlength: 120 },
    status: { type: String, enum: ["open", "closed"], default: "open", index: true },
    messages: { type: [messageSchema], default: [] },
    lastMessageAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export default mongoose.model("HelplineConversation", helplineConversationSchema);
