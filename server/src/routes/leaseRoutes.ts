import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getLeases, getLeasesPayment } from "../controllers/leaseController";


const router = express.Router();

router.get("/", authMiddleware(["manager", "tenant"]), getLeases);
router.get("/:id/payments", authMiddleware(["manager", "tenant"]), getLeasesPayment);


export default router;