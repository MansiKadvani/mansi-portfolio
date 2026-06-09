import { Router } from "express";
import { downloadResume } from "../controllers/resumeController";

const router = Router();

router.get("/download", downloadResume);

export default router;
