import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/Portfolio";

export interface IDbStatus {
  isConnected: boolean;
  isFallback: boolean;
  type: "MongoDB" | "Local File System";
}

let dbStatus: IDbStatus = {
  isConnected: false,
  isFallback: true,
  type: "Local File System",
};

// Ensure data directory exists for local fallback storage
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const DATA_PATH = {
  contacts: path.join(DATA_DIR, "contacts.json"),
  projects: path.join(DATA_DIR, "projects.json"),
  skills: path.join(DATA_DIR, "skills.json"),
  profile: path.join(DATA_DIR, "profile.json"),
};

// Initialize default JSON data files if they do not exist
const initLocalFile = (filePath: string, defaultData: any) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), "utf-8");
  }
};

initLocalFile(DATA_PATH.contacts, []);
initLocalFile(DATA_PATH.projects, []);
initLocalFile(DATA_PATH.skills, []);
initLocalFile(DATA_PATH.profile, {});

export async function connectDB(): Promise<IDbStatus> {
  if (!MONGODB_URI || !MONGODB_URI.startsWith("mongodb")) {
    console.warn("⚠️ MONGODB_URI not provided or invalid. Falling back to local file storage.");
    dbStatus = {
      isConnected: false,
      isFallback: true,
      type: "Local File System",
    };
    return dbStatus;
  }

  try {
    // Attempt Mongoose connection with standard timeout options to avoid hanging
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    
    const dbName = mongoose.connection.db?.databaseName || "portfolio";
    console.log(`🚀 Connected to MongoDB successfully! Database active: [${dbName}]`);

    // Pre-create collections to guarantee their physical existence in MongoDB Atlas/Compass immediately
    if (mongoose.connection.db) {
      try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const existingCollectionNames = collections.map(c => c.name);
        
        // Mongoose automatically plurallizes model names "Project", "Skill", "Profile", "Contact"
        const targetCollections = ["projects", "skills", "profiles", "contacts"];
        for (const target of targetCollections) {
          if (!existingCollectionNames.includes(target)) {
            await mongoose.connection.db.createCollection(target);
            console.log(`📝 Instantly initialized MongoDB collection: [${target}]`);
          }
        }
      } catch (colErr) {
        console.warn("⚠️ Non-blocking warning initializing collections:", colErr);
      }
    }

    dbStatus = {
      isConnected: true,
      isFallback: false,
      type: "MongoDB",
    };
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.warn("⚠️ Falling back to local file storage database.");
    dbStatus = {
      isConnected: false,
      isFallback: true,
      type: "Local File System",
    };
  }

  return dbStatus;
}

export function getDbStatus(): IDbStatus {
  return {
    ...dbStatus,
    isConnected: mongoose.connection.readyState === 1,
  };
}
