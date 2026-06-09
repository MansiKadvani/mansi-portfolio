import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: "unread" | "read" | "archived";
  createdAt: Date;
}

const ContactSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, trim: true, default: "General Inquiry" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["unread", "read", "archived"],
      default: "unread",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
