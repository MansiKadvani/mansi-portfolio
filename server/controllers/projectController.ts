import { Request, Response } from "express";
import fs from "fs";
import Project from "../models/Project";
import { DATA_PATH, getDbStatus } from "../config/db";

// GET /api/projects - Get all projects
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = getDbStatus();
    let projects: any[] = [];

    if (dbStatus.isFallback) {
      if (fs.existsSync(DATA_PATH.projects)) {
        const fileData = fs.readFileSync(DATA_PATH.projects, "utf8");
        projects = JSON.parse(fileData || "[]");
      }
    } else {
      projects = await Project.find().sort({ order: 1 });
    }

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
      dbType: dbStatus.type,
    });
  } catch (error: any) {
    console.error("Error in getProjects:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Failed to fetch projects.",
    });
  }
};

// POST /api/projects - Create a new project (Admin Dashboard capacity)
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, problemSolved, techStack, keyFeatures, engineeringChallenges, githubUrl, liveUrl, image, isFeatured, order } = req.body;

    if (!title || !description || !problemSolved || !techStack || !keyFeatures || !engineeringChallenges || !githubUrl) {
      res.status(400).json({ success: false, error: "Missing required fields." });
      return;
    }

    const dbStatus = getDbStatus();
    let newProject: any;

    const projectData = {
      title,
      description,
      problemSolved,
      techStack: Array.isArray(techStack) ? techStack : techStack.split(",").map((s: string) => s.trim()),
      keyFeatures: Array.isArray(keyFeatures) ? keyFeatures : keyFeatures.split(",").map((s: string) => s.trim()),
      engineeringChallenges,
      githubUrl,
      liveUrl: liveUrl || "",
      isFeatured: !!isFeatured,
      image: image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      order: order || 0,
    };

    if (dbStatus.isFallback) {
      const fileData = fs.readFileSync(DATA_PATH.projects, "utf8");
      const projects = JSON.parse(fileData || "[]");
      newProject = {
        _id: `proj_${Date.now()}`,
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      projects.push(newProject);
      fs.writeFileSync(DATA_PATH.projects, JSON.stringify(projects, null, 2), "utf8");
    } else {
      newProject = await Project.create(projectData);
    }

    res.status(201).json({
      success: true,
      message: "Project created successfully!",
      data: newProject,
    });
  } catch (error: any) {
    console.error("Error in createProject:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Failed to create project.",
    });
  }
};

// PUT /api/projects/:id - Update an existing project
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, problemSolved, techStack, keyFeatures, engineeringChallenges, githubUrl, liveUrl, image, isFeatured, order } = req.body;

    if (!title || !description || !problemSolved || !techStack || !keyFeatures || !engineeringChallenges || !githubUrl) {
      res.status(400).json({ success: false, error: "Missing required fields." });
      return;
    }

    const dbStatus = getDbStatus();
    let updatedProject: any;

    const projectData = {
      title,
      description,
      problemSolved,
      techStack: Array.isArray(techStack) ? techStack : techStack.split(",").map((s: string) => s.trim()),
      keyFeatures: Array.isArray(keyFeatures) ? keyFeatures : keyFeatures.split(",").map((s: string) => s.trim()),
      engineeringChallenges,
      githubUrl,
      liveUrl: liveUrl || "",
      isFeatured: !!isFeatured,
      image: image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      order: order || 0,
    };

    if (dbStatus.isFallback) {
      const fileData = fs.readFileSync(DATA_PATH.projects, "utf8");
      let projects = JSON.parse(fileData || "[]");
      const index = projects.findIndex((p: any) => p._id === id);
      if (index === -1) {
        res.status(404).json({ success: false, error: "Project not found." });
        return;
      }
      updatedProject = {
        ...projects[index],
        ...projectData,
        updatedAt: new Date().toISOString(),
      };
      projects[index] = updatedProject;
      fs.writeFileSync(DATA_PATH.projects, JSON.stringify(projects, null, 2), "utf8");
    } else {
      updatedProject = await (Project as any).findByIdAndUpdate(id, projectData, { new: true });
      if (!updatedProject) {
        res.status(404).json({ success: false, error: "Project not found in MongoDB." });
        return;
      }
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully!",
      data: updatedProject,
    });
  } catch (error: any) {
    console.error("Error in updateProject:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Failed to update project.",
    });
  }
};

// DELETE /api/projects/:id - Delete a project
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dbStatus = getDbStatus();

    if (dbStatus.isFallback) {
      const fileData = fs.readFileSync(DATA_PATH.projects, "utf8");
      let projects = JSON.parse(fileData || "[]");
      const index = projects.findIndex((p: any) => p._id === id);
      if (index === -1) {
        res.status(404).json({ success: false, error: "Project not found." });
        return;
      }
      projects.splice(index, 1);
      fs.writeFileSync(DATA_PATH.projects, JSON.stringify(projects, null, 2), "utf8");
    } else {
      const deletedProject = await (Project as any).findByIdAndDelete(id);
      if (!deletedProject) {
        res.status(404).json({ success: false, error: "Project not found in MongoDB." });
        return;
      }
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully!",
    });
  } catch (error: any) {
    console.error("Error in deleteProject:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Failed to delete project.",
    });
  }
};
