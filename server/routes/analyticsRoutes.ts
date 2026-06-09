import { Router, Request, Response } from "express";
import fs from "fs";
import { getDbStatus, DATA_PATH } from "../config/db";
import Contact from "../models/Contact";
import Project from "../models/Project";
import Skill from "../models/Skill";

const router = Router();

router.get("/status", async (req: Request, res: Response) => {
  try {
    const dbStatus = getDbStatus();
    let stats = {
      contactsTotal: 0,
      contactsUnread: 0,
      projectsCount: 0,
      skillsCount: 0,
    };

    if (dbStatus.isFallback) {
      // Fetch stats from local file system
      if (fs.existsSync(DATA_PATH.contacts)) {
        const contacts = JSON.parse(fs.readFileSync(DATA_PATH.contacts, "utf8") || "[]");
        stats.contactsTotal = contacts.length;
        stats.contactsUnread = contacts.filter((c: any) => c.status === "unread").length;
      }
      if (fs.existsSync(DATA_PATH.projects)) {
        const projects = JSON.parse(fs.readFileSync(DATA_PATH.projects, "utf8") || "[]");
        stats.projectsCount = projects.length;
      }
      if (fs.existsSync(DATA_PATH.skills)) {
        const skills = JSON.parse(fs.readFileSync(DATA_PATH.skills, "utf8") || "[]");
        stats.skillsCount = skills.length;
      }
    } else {
      // Fetch stats from MongoDB via Mongoose
      stats.contactsTotal = await Contact.countDocuments();
      stats.contactsUnread = await Contact.countDocuments({ status: "unread" });
      stats.projectsCount = await Project.countDocuments();
      stats.skillsCount = await Skill.countDocuments();
    }

    res.status(200).json({
      success: true,
      dbStatus,
      stats,
    });
  } catch (error: any) {
    console.error("Error fetching admin status analytics:", error);
    res.status(500).json({ success: false, error: "Failed to fetch analytics." });
  }
});

export default router;
