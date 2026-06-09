import { Router } from "express";
import { getProfile, updateProfile, getProfileStats } from "../controllers/profileController";

const router = Router();

router.get("/", getProfile);
router.put("/", updateProfile);
router.get("/stats", getProfileStats);

export default router;
