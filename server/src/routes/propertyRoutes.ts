import express from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getProperty, getProperties, createProperty } from "../controllers/propertyControllers";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getProperties);
router.get("/:id", getProperty);
router.post("/", authMiddleware(["manager"]), upload.array("photos"), createProperty);

export default router;
