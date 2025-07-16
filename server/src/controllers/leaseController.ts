import {PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { Request } from 'express';


const prisma = new PrismaClient();

export const getLeases = async (req: Request, res: Response) : Promise<void> => {
    try {
        const leases = await prisma.lease.findMany({
            include:{
                tenant: true,
                property: true
            }
        })
        res.json(leases)
    } catch (error: any) {
        res.status(500).json({ message : `Error in retrieving leases: ${error.message}` });
    }
}

export const getLeasesPayment = async (req: Request, res: Response) : Promise<void> => {
    try {
        const {id} = req.params;
         const payments = await prisma.payment.findMany({
           where: {leaseId : Number(id)}
        })
        res.json(payments)
    } catch (error: any) {
        res.status(500).json({ message : `Error in retrieving lease payments: ${error.message}` });
    }
}

export const getLeasesByPropertyId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;
    const leases = await prisma.lease.findMany({
      where: { propertyId: Number(propertyId) },
      include: { tenant: true, property: true },
    });
    res.json(leases);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving leases: ${error.message}` });
  }
}
