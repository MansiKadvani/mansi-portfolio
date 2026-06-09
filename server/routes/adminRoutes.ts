import { Router } from "express";
import { loginAdmin, verifyAdminToken, recoverPasscode, resetPasscode } from "../controllers/adminController";

const router = Router();

router.post("/login", loginAdmin);
router.get("/verify", verifyAdminToken);
router.post("/recover", recoverPasscode);
router.post("/reset", resetPasscode);

export default router;
