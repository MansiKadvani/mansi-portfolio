import fs from "fs";
import { DATA_PATH, getDbStatus } from "./db";
import { defaultProjects, defaultSkills, defaultProfile } from "./seed_data";
import Project from "../models/Project";
import Skill from "../models/Skill";
import Profile from "../models/Profile";

export async function runSeeder() {
  const status = getDbStatus();

  const defaultTitles = [
    "SyncFlow AI: Automated Meeting Workspace & Action-Item Extractor",
    "KubeDesk: Container Metrics Monitor & Microservices Visualizer",
    "OptimRoute Logistics: Advanced Multi-Stop Route Path Optimization Engine"
  ];

  const defaultSkillNames = [
    "TypeScript", "JavaScript", "C++", "Python", "Java", "SQL",
    "React.js", "Next.js", "Tailwind CSS", "Redux Toolkit", "HTML5 & CSS3", "Redux",
    "Node.js", "Express.js", "REST APIs", "WebSockets", "GraphQL",
    "MongoDB", "Mongoose", "PostgreSQL", "Redis", "MySQL",
    "Gemini API", "TensorFlow", "LangChain", "Prompt Engineering",
    "Git & GitHub", "Docker", "Postman", "AWS S3 / EC2", "Vercel / Render",
    "Data Structures & Algorithms", "Object Oriented Programming (OOP)", "OOP Concept",
    "Database Management Systems", "Database Indexing", "Operating Systems",
    "Computer Networks & HTTP", "System Design Basic"
  ];

  if (status.isFallback) {
    console.log("📂 Seeding local database if empty...");
    
    // Clean old default projects if they exist in file database
    if (fs.existsSync(DATA_PATH.projects)) {
      try {
        const fileContent = fs.readFileSync(DATA_PATH.projects, "utf8");
        let data = fileContent ? JSON.parse(fileContent) : [];
        if (Array.isArray(data)) {
          const cleaned = data.filter((p: any) => !defaultTitles.includes(p.title));
          fs.writeFileSync(DATA_PATH.projects, JSON.stringify(cleaned, null, 2), "utf8");
        }
      } catch (e) {}
    }

    // Clean old default skills if they exist in file database
    if (fs.existsSync(DATA_PATH.skills)) {
      try {
        const fileContent = fs.readFileSync(DATA_PATH.skills, "utf8");
        let data = fileContent ? JSON.parse(fileContent) : [];
        if (Array.isArray(data)) {
          const cleaned = data.filter((s: any) => !defaultSkillNames.includes(s.name));
          fs.writeFileSync(DATA_PATH.skills, JSON.stringify(cleaned, null, 2), "utf8");
        }
      } catch (e) {}
    }

    // Seed projects
    let seedProjects = false;
    if (!fs.existsSync(DATA_PATH.projects)) {
      seedProjects = true;
    } else {
      try {
        const fileContent = fs.readFileSync(DATA_PATH.projects, "utf8");
        const data = fileContent ? JSON.parse(fileContent) : [];
        if (!Array.isArray(data) || data.length === 0) {
          seedProjects = true;
        }
      } catch (e) {
        seedProjects = true;
      }
    }
    if (seedProjects && defaultProjects.length > 0) {
      fs.writeFileSync(DATA_PATH.projects, JSON.stringify(defaultProjects, null, 2), "utf8");
      console.log("✅ Seeded default projects to local storage.");
    }

    // Seed skills
    let seedSkills = false;
    if (!fs.existsSync(DATA_PATH.skills)) {
      seedSkills = true;
    } else {
      try {
        const fileContent = fs.readFileSync(DATA_PATH.skills, "utf8");
        const data = fileContent ? JSON.parse(fileContent) : [];
        if (!Array.isArray(data) || data.length === 0) {
          seedSkills = true;
        }
      } catch (e) {
        seedSkills = true;
      }
    }
    if (seedSkills && defaultSkills.length > 0) {
      fs.writeFileSync(DATA_PATH.skills, JSON.stringify(defaultSkills, null, 2), "utf8");
      console.log("✅ Seeded default skills to local storage.");
    }

    // Seed profile
    let seedProfile = false;
    if (!fs.existsSync(DATA_PATH.profile)) {
      seedProfile = true;
    } else {
      try {
        const fileContent = fs.readFileSync(DATA_PATH.profile, "utf8");
        const data = fileContent ? JSON.parse(fileContent) : null;
        if (!data || Object.keys(data).length === 0) {
          seedProfile = true;
        }
      } catch (e) {
        seedProfile = true;
      }
    }
    if (seedProfile) {
      fs.writeFileSync(DATA_PATH.profile, JSON.stringify(defaultProfile, null, 2), "utf8");
      console.log("✅ Seeded default profile to local storage.");
    }
  } else {
    console.log("🍃 Seeding MongoDB databases if empty...");
    try {
      // Instantly delete any old default test items inside real MongoDB on launch
      const delProjCount = await Project.deleteMany({ title: { $in: defaultTitles } });
      if (delProjCount.deletedCount > 0) {
        console.log(`🧹 Cleared ${delProjCount.deletedCount} default dummy projects from MongoDB.`);
      }

      const delSkillCount = await Skill.deleteMany({ name: { $in: defaultSkillNames } });
      if (delSkillCount.deletedCount > 0) {
        console.log(`🧹 Cleared ${delSkillCount.deletedCount} default dummy skills from MongoDB.`);
      }

      // Seed Projects
      const projectCount = await Project.countDocuments();
      if (projectCount === 0 && defaultProjects.length > 0) {
        await Project.insertMany(defaultProjects as any);
        console.log("✅ Seeded default projects to MongoDB.");
      }

      // Seed Skills
      const skillCount = await Skill.countDocuments();
      if (skillCount === 0 && defaultSkills.length > 0) {
        await Skill.insertMany(defaultSkills as any);
        console.log("✅ Seeded default skills to MongoDB.");
      }

      // Seed Profile
      const profileCount = await Profile.countDocuments();
      if (profileCount === 0) {
        await Profile.create(defaultProfile);
        console.log("✅ Seeded default profile to MongoDB.");
      }
    } catch (error) {
      console.error("❌ Seeding MongoDB error:", error);
    }
  }
}
