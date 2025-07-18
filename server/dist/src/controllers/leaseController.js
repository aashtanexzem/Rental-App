"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeasesByPropertyId = exports.getLeasesPayment = exports.getLeases = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getLeases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leases = yield prisma.lease.findMany({
            include: {
                tenant: true,
                property: true
            }
        });
        res.json(leases);
    }
    catch (error) {
        res.status(500).json({ message: `Error in retrieving leases: ${error.message}` });
    }
});
exports.getLeases = getLeases;
const getLeasesPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const payments = yield prisma.payment.findMany({
            where: { leaseId: Number(id) }
        });
        res.json(payments);
    }
    catch (error) {
        res.status(500).json({ message: `Error in retrieving lease payments: ${error.message}` });
    }
});
exports.getLeasesPayment = getLeasesPayment;
const getLeasesByPropertyId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { propertyId } = req.params;
        const leases = yield prisma.lease.findMany({
            where: { propertyId: Number(propertyId) },
            include: { tenant: true, property: true },
        });
        res.json(leases);
    }
    catch (error) {
        res.status(500).json({ message: `Error retrieving leases: ${error.message}` });
    }
});
exports.getLeasesByPropertyId = getLeasesByPropertyId;
