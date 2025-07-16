
import {PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { Request } from 'express';



const prisma = new PrismaClient();

export const listApplication= async (req: Request, res: Response) : Promise<void> => {
    try {
        const {userId, userType} = req.query;
        let whereClause = {};

        if (userId && userType){
            if(userType === "manager"){
                whereClause ={
                    property : {
                        managerCognitoId : String(userId),
                    }
                }

            }
            else if(userType === "tenant"){
                whereClause ={ tenantCognitoId : String(userId)}
            }
        }

        const application = await prisma.application.findMany({
            where: whereClause,
            include: {
                property:{
                    include: {
                        location: true,
                        manager: true
                    }
                },
                tenant: true
            }
        });

        function calculateNextPaymentDate(startDate: Date): Date {
            const today = new Date();
            const nextPaymentDate = new Date(startDate)
            while(nextPaymentDate <= today){
                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
            }
            return nextPaymentDate
        }

        const formattedApplication = await Promise.all(
            application.map(async(app)=>{
                const lease = await prisma.lease.findFirst({
                    where: {
                        tenant: {
                            cognitoId: app.tenantCognitoId
                        },
                        propertyId: app.propertyId
                    },
orderBy: {startDate: "desc"}
                });

                return{
                    ...app,
                    property: {
                        ...app.property,
                        address: app.property.location.address,
                    },
                    manager: app.property.manager,
                    lease: lease
                    ? {
                        ...lease,
                        nextPaymentDate : calculateNextPaymentDate(lease.startDate)
                    }
                    : null,
                }
            })
        );
        res.json(formattedApplication)
       
    } catch (error: any) {
        res.status(500).json({ message : `Error in retrieving application: ${error.message}` });
    }
}

export const createApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      applicationDate,
      status,
      propertyId,
      tenantCognitoId,
      name,
      email,
      phoneNumber,
      message,
    } = req.body;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { pricePerMonth: true, securityDeposit: true },
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    const newApplication = await prisma.application.create({
      data: {
        applicationDate: new Date(applicationDate),
        status,
        property: { connect: { id: propertyId } },
        tenant: { connect: { cognitoId: tenantCognitoId } },
        name,
        email,
        phoneNumber,
        message,
      },
    });

    res.status(201).json(newApplication);
  } catch (error: any) {
    res.status(500).json({ message: `Error in creating application: ${error.message}` });
  }
};



export const updateApplicationStatus= async (req: Request, res: Response) : Promise<void> => {
    try {
        const {id}= req.params;
        const {status} = req.body;

        const application= await prisma.application.findUnique({
            where: {id: Number(id)},
            include: {
                property:true,
                tenant: true,
            },
        });

        if(!application){
            res.status(404).json({message: "Application not found."});
            return;
        }

        if(status === "Approved"){
            const newLease = await prisma.lease.create({
                data: {
                    startDate: new Date(),
                    endDate: new Date(
                        new Date().setFullYear(new Date().getFullYear()+1)
                    ),
                    rent: application.property.pricePerMonth,
                    deposit: application.property.securityDeposit,
                    propertyId: application.propertyId,
                    tenantCognitoId: application.tenantCognitoId,
                },
            });

            // Update the property to connect the tenant
            await prisma.property.update({
                where: {id: application.propertyId},
                data: {
                    tenants: {
                        connect: { cognitoId: application.tenantCognitoId },
                    }
                },
            });

            // Update the application with the new lease ID
            const updatedApplication = await prisma.application.update({
                where: { id: Number(id)},
                data: {
                    status,
                    leaseId: newLease.id
                },
                include:{
                    property: true,
                    tenant: true,
                    lease: true,
                }
            });

            res.json(updatedApplication); 

        } else {
            // Update the application status (for "Denied" or other statuses)
            const updatedApplication = await prisma.application.update({
                where: {id: Number(id)},
                data: {status},
            });

            res.json(updatedApplication); 
        }
        
    } catch (error: any) {
        res.status(500).json({ message : `Error in updating application status: ${error.message}` });
    }
}

