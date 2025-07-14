import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createApplication, listApplication, updateApplicationStatus } from "../controllers/applicationController";



const router = express.Router();

router.post("/", authMiddleware(["tenant"]), createApplication);
router.put("/:id/status", authMiddleware(["manager"]), updateApplicationStatus);
router.get("/", authMiddleware(["tenant", "manager"]), listApplication);


export default router;