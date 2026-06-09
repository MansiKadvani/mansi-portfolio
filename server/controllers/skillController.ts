import { Request, Response } from "express";
import fs from "fs";
import Skill from "../models/Skill";
import { DATA_PATH, getDbStatus } from "../config/db";

// GET /api/skills - Get all skills categorized
export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = getDbStatus();
    let skills: any[] = [];

    if (dbStatus.isFallback) {
      if (fs.existsSync(DATA_PATH.skills)) {
        const fileData = fs.readFileSync(DATA_PATH.skills, "utf8");
        skills = JSON.parse(fileData || "[]");
      }
    } else {
      skills = await Skill.find().sort({ name: 1 });
    }

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
      dbType: dbStatus.type,
    });
  } catch (error: any) {
    console.error("Error in getSkills:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Failed to fetch skills.",
    });
  }
};

// POST /api/skills - Create a new skill (Admin view compatibility)
export const createSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, iconName, isPopular } = req.body;

    if (!name || !category || !iconName) {
      res.status(400).json({ success: false, error: "Missing required fields (name, category, iconName)." });
      return;
    }

    const categories = ["languages", "frontend", "backend", "database", "ai-ml", "tools", "core-cs"];
    if (!categories.includes(category)) {
      res.status(400).json({ success: false, error: `Invalid category. Must be one of: ${categories.join(", ")}` });
      return;
    }

    const dbStatus = getDbStatus();
    let newSkill: any;

    const skillData = {
      name: name.trim(),
      category,
      iconName: iconName.trim(),
      isPopular: !!isPopular,
    };

    if (dbStatus.isFallback) {
      const fileData = fs.readFileSync(DATA_PATH.skills, "utf8");
      const skills = JSON.parse(fileData || "[]");
      newSkill = {
        _id: `skill_${Date.now()}`,
        ...skillData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      skills.push(newSkill);
      fs.writeFileSync(DATA_PATH.skills, JSON.stringify(skills, null, 2), "utf8");
    } else {
      newSkill = await Skill.create(skillData);
    }

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: newSkill,
    });
  } catch (error: any) {
    console.error("Error in createSkill:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Failed to create skill.",
    });
  }
};

// PUT /api/skills/:id - Update an existing skill
export const updateSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, category, iconName, isPopular } = req.body;

    if (!name || !category || !iconName) {
      res.status(400).json({ success: false, error: "Missing required fields (name, category, iconName)." });
      return;
    }

    const categories = ["languages", "frontend", "backend", "database", "ai-ml", "tools", "core-cs"];
    if (!categories.includes(category)) {
      res.status(400).json({ success: false, error: `Invalid category. Must be one of: ${categories.join(", ")}` });
      return;
    }

    const dbStatus = getDbStatus();
    let updatedSkill: any;

    const skillData = {
      name: name.trim(),
      category,
      iconName: iconName.trim(),
      isPopular: !!isPopular,
    };

    if (dbStatus.isFallback) {
      const fileData = fs.readFileSync(DATA_PATH.skills, "utf8");
      let skills = JSON.parse(fileData || "[]");
      const index = skills.findIndex((s: any) => s._id === id);
      if (index === -1) {
        res.status(404).json({ success: false, error: "Skill not found." });
        return;
      }
      updatedSkill = {
        ...skills[index],
        ...skillData,
        updatedAt: new Date().toISOString(),
      };
      skills[index] = updatedSkill;
      fs.writeFileSync(DATA_PATH.skills, JSON.stringify(skills, null, 2), "utf8");
    } else {
      updatedSkill = await (Skill as any).findByIdAndUpdate(id, skillData, { new: true });
      if (!updatedSkill) {
        res.status(404).json({ success: false, error: "Skill not found in MongoDB." });
        return;
      }
    }

    res.status(200).json({
      success: true,
      message: "Skill updated successfully!",
      data: updatedSkill,
    });
  } catch (error: any) {
    console.error("Error in updateSkill:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Failed to update skill.",
    });
  }
};

// DELETE /api/skills/:id - Delete an existing skill
export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dbStatus = getDbStatus();

    if (dbStatus.isFallback) {
      const fileData = fs.readFileSync(DATA_PATH.skills, "utf8");
      let skills = JSON.parse(fileData || "[]");
      const index = skills.findIndex((s: any) => s._id === id);
      if (index === -1) {
        res.status(404).json({ success: false, error: "Skill not found." });
        return;
      }
      skills.splice(index, 1);
      fs.writeFileSync(DATA_PATH.skills, JSON.stringify(skills, null, 2), "utf8");
    } else {
      const deletedSkill = await (Skill as any).findByIdAndDelete(id);
      if (!deletedSkill) {
        res.status(404).json({ success: false, error: "Skill not found in MongoDB." });
        return;
      }
    }

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully!",
    });
  } catch (error: any) {
    console.error("Error in deleteSkill:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Failed to delete skill.",
    });
  }
};
