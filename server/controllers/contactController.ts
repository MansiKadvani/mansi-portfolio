import { Request, Response } from "express";
import fs from "fs";
import Contact from "../models/Contact";
import { DATA_PATH, getDbStatus } from "../config/db";

// POST /api/contact - Submit a contact message
export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    // 1. Validation Checks
    if (!name || name.trim() === "") {
      res.status(400).json({ success: false, error: "Name is required." });
      return;
    }

    if (!email || email.trim() === "") {
      res.status(400).json({ success: false, error: "Email is required." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, error: "Please enter a valid email address." });
      return;
    }

    if (!message || message.trim() === "") {
      res.status(400).json({ success: false, error: "Message content is required." });
      return;
    }

    if (message.length < 10) {
      res.status(400).json({ success: false, error: "Message must be at least 10 characters long." });
      return;
    }

    const dbStatus = getDbStatus();
    let newContactMessage: any;

    if (dbStatus.isFallback) {
      // Fallback store in local JSON file
      const fileData = fs.readFileSync(DATA_PATH.contacts, "utf8");
      const messages = JSON.parse(fileData || "[]");
      
      newContactMessage = {
        _id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject ? subject.trim() : "General Inquiry",
        message: message.trim(),
        status: "unread",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      messages.unshift(newContactMessage);
      fs.writeFileSync(DATA_PATH.contacts, JSON.stringify(messages, null, 2), "utf8");
    } else {
      // Save to real MongoDB via Mongoose
      newContactMessage = await Contact.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject ? subject.trim() : "General Inquiry",
        message: message.trim(),
        status: "unread",
      });
    }

    res.status(201).json({
      success: true,
      message: "Message submitted successfully! Thank you.",
      data: newContactMessage,
      dbType: dbStatus.type,
    });
  } catch (error: any) {
    console.error("Error in submitContact:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Failed to save message.",
    });
  }
};

// GET /api/contact - View submissions (Inbox for Admin dashboard view)
export const getContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = getDbStatus();
    let messages: any[] = [];

    if (dbStatus.isFallback) {
      const fileData = fs.readFileSync(DATA_PATH.contacts, "utf8");
      messages = JSON.parse(fileData || "[]");
    } else {
      messages = await Contact.find().sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
      dbType: dbStatus.type,
    });
  } catch (error: any) {
    console.error("Error in getContacts:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Failed to fetch messages.",
    });
  }
};

// PUT /api/contact/:id - Update status (read/unread/archived)
export const updateContactStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["unread", "read", "archived"].includes(status)) {
      res.status(400).json({ success: false, error: "Invalid status state." });
      return;
    }

    const dbStatus = getDbStatus();
    let updatedMessage: any = null;

    if (dbStatus.isFallback) {
      const fileData = fs.readFileSync(DATA_PATH.contacts, "utf8");
      const messages = JSON.parse(fileData || "[]");
      const index = messages.findIndex((m: any) => m._id === id);

      if (index !== -1) {
        messages[index].status = status;
        messages[index].updatedAt = new Date().toISOString();
        updatedMessage = messages[index];
        fs.writeFileSync(DATA_PATH.contacts, JSON.stringify(messages, null, 2), "utf8");
      }
    } else {
      updatedMessage = await (Contact as any).findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );
    }

    if (!updatedMessage) {
      res.status(404).json({ success: false, error: "Contact message not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Message marked as ${status}.`,
      data: updatedMessage,
    });
  } catch (error: any) {
    console.error("Error in updateContactStatus:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Failed to update message.",
    });
  }
};

// DELETE /api/contact/:id - Delete a contact message
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dbStatus = getDbStatus();
    let deleted = false;

    if (dbStatus.isFallback) {
      const fileData = fs.readFileSync(DATA_PATH.contacts, "utf8");
      const messages = JSON.parse(fileData || "[]");
      const index = messages.findIndex((m: any) => m._id === id);

      if (index !== -1) {
        messages.splice(index, 1);
        fs.writeFileSync(DATA_PATH.contacts, JSON.stringify(messages, null, 2), "utf8");
        deleted = true;
      }
    } else {
      const result = await (Contact as any).findByIdAndDelete(id);
      if (result) {
        deleted = true;
      }
    }

    if (!deleted) {
      res.status(404).json({ success: false, error: "Contact message not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error in deleteContact:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Failed to delete message.",
    });
  }
};

