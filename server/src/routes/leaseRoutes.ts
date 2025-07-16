
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getLeases, getLeasesByPropertyId, getLeasesPayment } from "../controllers/leaseController";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


const router = express.Router();

router.get("/", authMiddleware(["manager", "tenant"]), getLeases);
router.get("/:id/payments", authMiddleware(["manager", "tenant"]), getLeasesPayment);
router.get("/property/:propertyId", authMiddleware(["manager", "tenant"]), getLeasesByPropertyId);


export default router;