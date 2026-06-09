import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { connectDB } from "./server/config/db";
import { runSeeder } from "./server/config/seeder";

// Load environment variables
dotenv.config();

// Standard API Routers
import contactRouter from "./server/routes/contactRoutes";
import projectRouter from "./server/routes/projectRoutes";
import skillRouter from "./server/routes/skillRoutes";
import resumeRouter from "./server/routes/resumeRoutes";
import analyticsRouter from "./server/routes/analyticsRoutes";
import profileRouter from "./server/routes/profileRoutes";
import adminRouter from "./server/routes/adminRoutes";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Debug Logger for debugging API endpoints
  app.use((req, res, next) => {
    if (req.url.startsWith("/api")) {
      const logMsg = `📡 [Express Request] ${req.method} ${req.url} [Timestamp: ${new Date().toISOString()}] | Body: ${JSON.stringify(req.body)}\n`;
      try {
        const logPath = path.join(process.cwd(), "data", "express_routing.log");
        fs.appendFileSync(logPath, logMsg, "utf8");
      } catch (err) {}
      
      res.on("finish", () => {
        const resMsg = `📡 [Express Response] ${req.method} ${req.url} -> Status ${res.statusCode} [Timestamp: ${new Date().toISOString()}]\n`;
        try {
          const logPath = path.join(process.cwd(), "data", "express_routing.log");
          fs.appendFileSync(logPath, resMsg, "utf8");
        } catch (err) {}
      });
    }
    next();
  });

  // Initialize DB and Seeder
  const dbStatus = await connectDB();
  await runSeeder();

  // API Routes (Must go FIRST before Vite serves static assets or index)
  app.use("/api/admin", adminRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/projects", projectRouter);
  app.use("/api/skills", skillRouter);
  app.use("/api/resume", resumeRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/profile", profileRouter);

  // Health and DB stats route
  app.get("/api/health", (req, res) => {
    res.json({
      status: "online",
      db: dbStatus,
      timestamp: new Date().toISOString()
    });
  });

  // Client SPA integrations
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("\n  =======================================================");
    console.log("  ⚡ Portfolio Operations Active");
    console.log("  =======================================================");
    console.log(`  ▪ Service Mode  : ${process.env.NODE_ENV !== "production" ? "DEVELOPMENT" : "PRODUCTION"}`);
    console.log(`  ▪ DB Gateway    : [${dbStatus.type.toUpperCase()}]`);
    console.log(`  ▪ Local Address : http://localhost:${PORT}`);
    console.log("  =======================================================\n");
  });
}

startServer().catch((error) => {
  console.error("☠️ Critical build error - Server failed to boot:", error);
});
