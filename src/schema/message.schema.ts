import mongoose, { Types } from "mongoose";
import { type BaseSchema } from "./index";

const Schema = mongoose.Schema;

export interface IChatMessage extends BaseSchema {
  sender: Types.ObjectId;
  senderRole: string;
  message: string;
  roomId: string;
  timestamp: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["user", "admin", "teacher"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const ChatMessage = mongoose.model<IChatMessage>(
  "chatMessage",
  ChatMessageSchema
);

export default ChatMessage;
