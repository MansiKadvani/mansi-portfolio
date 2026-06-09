import { Request, Response } from "express";
import fs from "fs";
import { DATA_PATH, getDbStatus } from "../config/db";
import Profile from "../models/Profile";
import Project from "../models/Project";
import Skill from "../models/Skill";
import PDFDocument from "pdfkit";

export const downloadResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = getDbStatus();
    let profileData: any = null;
    let projectsList: any[] = [];
    let skillsList: any[] = [];

    // Load data dynamically
    if (dbStatus.isFallback) {
      if (fs.existsSync(DATA_PATH.profile)) {
        try {
          const fileData = fs.readFileSync(DATA_PATH.profile, "utf8");
          profileData = JSON.parse(fileData || "null");
        } catch (e) {
          console.warn("⚠️ Falling back to defaults.", e);
        }
      }
      if (fs.existsSync(DATA_PATH.projects)) {
        try {
          const fileData = fs.readFileSync(DATA_PATH.projects, "utf8");
          projectsList = JSON.parse(fileData || "[]");
        } catch (e) {
          console.warn("⚠️ Falling back to defaults.", e);
        }
      }
      if (fs.existsSync(DATA_PATH.skills)) {
        try {
          const fileData = fs.readFileSync(DATA_PATH.skills, "utf8");
          skillsList = JSON.parse(fileData || "[]");
        } catch (e) {
          console.warn("⚠️ Falling back to defaults.", e);
        }
      }
    } else {
      try {
        profileData = await Profile.findOne().lean();
        projectsList = await Project.find().sort({ order: 1 }).lean();
        skillsList = await Skill.find().lean();
      } catch (dbErr) {
        console.warn("⚠️ DB compile error during resume build:", dbErr);
      }
    }

    // Set Default / Fallback SDE Values matching the uploaded PDF
    const candidateName = "Mansi Kadvani";
    const emailStr = "mrk912007@gmail.com";
    const phoneStr = "+91 6352832766";
    const linkedinStr = "https://linkedin.com/in/mansi-kadvani-01";
    const githubStr = "https://github.com/MansiKadvani";
    const portfolioStr = "https://mansi-kadvani.vercel.app";

    // Setup document PDFKit
    const doc = new PDFDocument({ margin: 40, size: "A4" });

    // Stream download directly
    res.setHeader("Content-Disposition", "attachment; filename=Mansi_Kadvani_Resume.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    doc.pipe(res);

    let currentY = 40;

    // --- 1. HEADER SECTION ---
    doc.fontSize(22).font("Helvetica-Bold").fillColor("#000000").text(candidateName, 40, currentY, { align: "center" });
    currentY += 26;

    // Contacts block
    const contactLine = `${phoneStr}  |  ${emailStr}  |  LinkedIn  |  GitHub  |  Portfolio`;
    doc.fontSize(9.5).font("Helvetica").fillColor("#000000").text(contactLine, 40, currentY, { align: "center" });
    currentY += 18;

    // Divider Helper
    const addSectionDivider = (title: string, yPos: number): number => {
      doc.fontSize(10.5).font("Helvetica-Bold").fillColor("#000000").text(title.toUpperCase(), 40, yPos);
      doc.moveTo(40, yPos + 12).lineTo(555, yPos + 12).strokeColor("#000000").lineWidth(0.8).stroke();
      return yPos + 20;
    };

    // --- 2. EDUCATION SECTION ---
    currentY = addSectionDivider("Education", currentY);

    // B.Tech
    doc.fontSize(9.5).font("Helvetica-Bold").fillColor("#000000").text("Marwadi University", 40, currentY);
    doc.fontSize(9.5).font("Helvetica").text("Rajkot, Gujarat", 555 - doc.widthOfString("Rajkot, Gujarat"), currentY);
    currentY += 12;
    doc.fontSize(9).font("Helvetica-Oblique").text("Bachelor of Technology (B.Tech) in Computer Engineering", 40, currentY);
    doc.fontSize(9).font("Helvetica").text("2025 - 2027 (Expected)", 555 - doc.widthOfString("2025 - 2027 (Expected)"), currentY);
    currentY += 16;

    // Diploma
    doc.fontSize(9.5).font("Helvetica-Bold").text("Marwadi University", 40, currentY);
    doc.fontSize(9.5).font("Helvetica").text("Rajkot, Gujarat", 555 - doc.widthOfString("Rajkot, Gujarat"), currentY);
    currentY += 12;
    doc.fontSize(9).font("Helvetica-Oblique").text("Diploma in Computer Engineering - CGPA: 9.78 / 10.00", 40, currentY);
    doc.fontSize(9).font("Helvetica").text("2022 - 2025", 555 - doc.widthOfString("2022 - 2025"), currentY);
    currentY += 22;

    // --- 3. TECHNICAL SKILLS SECTION ---
    currentY = addSectionDivider("Technical Skills", currentY);

    const skills = [
      { label: "Languages", val: "C, JavaScript, Python" },
      { label: "Frontend", val: "HTML5, CSS3, Bootstrap, React.js" },
      { label: "Backend", val: "Node.js, Express.js, Django" },
      { label: "Databases", val: "MongoDB, MySQL" },
      { label: "Core CS", val: "Data Structures Algorithms, Object-Oriented Programming, DBMS" },
      { label: "Developer Tools", val: "Git, GitHub, VS Code, Postman" },
      { label: "AI Data", val: "Pandas, NumPy, Matplotlib, Machine Learning Fundamentals" }
    ];

    skills.forEach((sk) => {
      doc.fontSize(9).font("Helvetica-Bold").text(`${sk.label}:`, 40, currentY);
      doc.font("Helvetica").text(sk.val, 150, currentY, { width: 405 });
      currentY += 13;
    });
    currentY += 10;

    // --- 4. PROJECTS SECTION ---
    currentY = addSectionDivider("Projects", currentY);

    // Project 1: FixFlow
    doc.fontSize(9.5).font("Helvetica-Bold").text("FixFlow", 40, currentY);
    doc.fontSize(9).font("Helvetica").text(" | React.js, Node.js, Express.js, MongoDB", 40 + doc.widthOfString("FixFlow"), currentY + 0.5);
    doc.fontSize(9.5).font("Helvetica").text("2026", 555 - doc.widthOfString("2026"), currentY);
    currentY += 13;

    const fixflowBullets = [
      "Developed a full-stack service management platform connecting customers, service providers, and administrators.",
      "Designed a rule-based allocation system considering service type, availability, workload, and performance factors.",
      "Built RESTful APIs, authentication workflows, and role-based dashboards.",
      "Implemented scalable MongoDB database operations and backend services."
    ];
    fixflowBullets.forEach((bullet) => {
      doc.fontSize(8.5).font("Helvetica").text("•", 48, currentY);
      doc.text(bullet, 58, currentY, { width: 497, align: "justify" });
      const numLines = Math.ceil(doc.widthOfString(bullet) / 497);
      currentY += (numLines * 11);
    });
    currentY += 8;

    // Project 2: StyleSurfer
    doc.fontSize(9.5).font("Helvetica-Bold").text("StyleSurfer", 40, currentY);
    doc.fontSize(9).font("Helvetica").text(" | Python, Django, HTML, CSS, JavaScript, MySQL", 40 + doc.widthOfString("StyleSurfer"), currentY + 0.5);
    doc.fontSize(9.5).font("Helvetica").text("2025", 555 - doc.widthOfString("2025"), currentY);
    currentY += 13;

    const stylesurferBullets = [
      "Developed a full-stack sustainable fashion rental and resale platform.",
      "Implemented outfit rental, resale, and customization workflows for users.",
      "Designed responsive interfaces and integrated backend database operations.",
      "Built multi-role platform functionality supporting customers and administrators."
    ];
    stylesurferBullets.forEach((bullet) => {
      doc.fontSize(8.5).font("Helvetica").text("•", 48, currentY);
      doc.text(bullet, 58, currentY, { width: 497, align: "justify" });
      const numLines = Math.ceil(doc.widthOfString(bullet) / 497);
      currentY += (numLines * 11);
    });
    currentY += 8;

    // Project 3: CareerPulse
    doc.fontSize(9.5).font("Helvetica-Bold").text("CareerPulse", 40, currentY);
    doc.fontSize(9).font("Helvetica").text(" | Python, Pandas, NumPy, Matplotlib", 40 + doc.widthOfString("CareerPulse"), currentY + 0.5);
    doc.fontSize(9.5).font("Helvetica").text("2025", 555 - doc.widthOfString("2025"), currentY);
    currentY += 13;

    const careerpulseBullets = [
      "Built an AI-powered career analytics dashboard for placement prediction and skill-gap analysis.",
      "Performed data preprocessing, visualization, and statistical analysis using Python libraries.",
      "Generated insights related to placement probability, salary trends, and learning recommendations.",
      "Created visual reports to support career planning and decision-making."
    ];
    careerpulseBullets.forEach((bullet) => {
      doc.fontSize(8.5).font("Helvetica").text("•", 48, currentY);
      doc.text(bullet, 58, currentY, { width: 497, align: "justify" });
      const numLines = Math.ceil(doc.widthOfString(bullet) / 497);
      currentY += (numLines * 11);
    });
    currentY += 16;

    // --- 5. EXPERIENCE SECTION ---
    currentY = addSectionDivider("Experience", currentY);

    doc.fontSize(9.5).font("Helvetica-Bold").text("Python Intern", 40, currentY);
    doc.fontSize(9.5).font("Helvetica").text("2024", 555 - doc.widthOfString("2024"), currentY);
    currentY += 12;
    doc.fontSize(9).font("Helvetica-Oblique").text("BytesBizz Technology", 40, currentY);
    doc.fontSize(9).font("Helvetica").text("On-Site", 555 - doc.widthOfString("On-Site"), currentY);
    currentY += 14;

    const internBullets = [
      "Learned Python programming fundamentals and backend development concepts through practical assignments.",
      "Explored Django framework for web application development and database integration.",
      "Built mini applications and strengthened debugging, problem-solving, and software development skills.",
      "Gained practical exposure to backend development workflows, project implementation, and collaborative development practices."
    ];
    internBullets.forEach((bullet) => {
      doc.fontSize(8.5).font("Helvetica").text("•", 48, currentY);
      doc.text(bullet, 58, currentY, { width: 497, align: "justify" });
      const numLines = Math.ceil(doc.widthOfString(bullet) / 497);
      currentY += (numLines * 11);
    });
    currentY += 14;

    // --- 6. ACHIEVEMENTS SECTION ---
    currentY = addSectionDivider("Achievements", currentY);

    const achievements = [
      "Patent Publication – Automated Clothing Rental Kiosk (Application No. 202521070250 A), Indian Patent Office.",
      "Letter of Appreciation from Marwadi University for contribution to a published patent.",
      "Award of Excellence – Secured 1st Rank with SGPA 10 in Diploma Semester 3, 5, and 6.",
      "Completed Python Internship at BytesBizz Technology with exposure to Django and backend development."
    ];
    achievements.forEach((ach) => {
      doc.fontSize(8.5).font("Helvetica").text("•", 48, currentY);
      doc.text(ach, 58, currentY, { width: 497, align: "justify" });
      const numLines = Math.ceil(doc.widthOfString(ach) / 497);
      currentY += (numLines * 11) + 2;
    });

    // Close and stream response
    doc.end();

  } catch (error) {
    console.error("Error generating resume pdf:", error);
    res.status(500).json({ success: false, error: "Failed to download professional resume PDF." });
  }
};
