import { Router } from "express";
import { submitContact, getContacts, updateContactStatus, deleteContact } from "../controllers/contactController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", submitContact);
router.get("/", authMiddleware, getContacts);
router.put("/:id", authMiddleware, updateContactStatus);
router.delete("/:id", authMiddleware, deleteContact);

export default router;
