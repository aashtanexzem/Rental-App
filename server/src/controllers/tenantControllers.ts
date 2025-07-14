import { wktToGeoJSON } from '@terraformer/wkt';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { Request } from 'express';

const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response) : Promise<void> => {
    try {
        const {cognitoId} = req.params;
        const tenant = await prisma.tenant.findUnique({
            where: {cognitoId},
            include:{
                favorites: true
            }
        });

        if (tenant) {
            res.status(200).json(tenant);
} else{
            res.status(404).json({ message: "Tenant not found" });
        }



        
    } catch (error: any) {
        res.status(500).json({ message : `Error in retrieving tennant: ${error.message}` });
    }
}

export const createTenant = async (req: Request, res: Response) : Promise<void> => {
    try {
        const {cognitoId, name, email, phoneNumber} = req.body;
        const tenant = await prisma.tenant.create({
            
            data: {
                cognitoId,
                name,
                email,
                phoneNumber
            },
            
        });
        res.status(201).json(tenant);

        if (tenant) {
            res.status(200).json(tenant);
} else{
            res.status(404).json({ message: "Tenant not found" });
        }



        
    } catch (error: any) {
        res.status(500).json({ message : `Error in creating tennant: ${error.message}` });
    }
}

export const updateTenant = async (req: Request, res: Response) : Promise<void> => {
    try {
const {cognitoId} = req.params;
const {name, email, phoneNumber} = req.body;
const tenant = await prisma.tenant.update({
    where: { cognitoId },
    data: {
        name,
        email,
        phoneNumber
    },
});

res.json(updateTenant);



        
    } catch (error: any) {
        res.status(500).json({ message : `Error in updating tennant: ${error.message}` });
    }
}

export const getCurrentResidences = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;

    const properties = await prisma.property.findMany({
      where: { tenants: { some: { cognitoId } } },
      include: {
        location: true,
      },
    });

    const residencesWithFormattedLocation = await Promise.all(
      properties.map(async (property) => {
        const coordinates: { coordinates: string }[] = await prisma.$queryRaw`
          SELECT ST_AsText(coordinates) as coordinates FROM "Location" WHERE id = ${property.location.id}`;

        const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
        const longitude = geoJSON.coordinates[0];
        const latitude = geoJSON.coordinates[1];

        return {
          ...property,
          location: {
            ...property.location,
            coordinates: {
              latitude,
              longitude,
            },
          },
        };
      })
    );

   
    res.status(200).json(residencesWithFormattedLocation);
  } catch (error: any) {
    res
      .status(500)
      .json({
        message: `Error in retrieving tenant current residence: ${error.message}`,
      });
  }
};


export const addFavoriteProperty = async (req: Request, res: Response):Promise <void> =>{
    try {
        const { cognitoId, propertyId} = req.params;
        const tenant = await prisma.tenant.findUnique({
            where: {cognitoId},
            include:{favorites: true}
        });

        const propertyIdNumber = Number(propertyId);
        const existingFavorites = tenant?.favorites || [];

        if (!existingFavorites.some((fav)=> fav.id === propertyIdNumber)){
            const updatedTenant = await prisma.tenant.update({
                where: {cognitoId},
                data: {
                    favorites:{
                        connect: {id: propertyIdNumber}
                    }
                },
                include: {favorites: true}
            })
            res.json(updateTenant)
        }
        else{
            res.status(409). json({message: "Property already added as favorite"})
        }
        
    }
     catch (error: any) {
        res.status(500).json({ message : `Error in adding tenants favorite property: ${ error.message }` });
    }
}

export const removeFavoriteProperty = async (req: Request, res: Response):Promise <void> =>{
    try {
        const { cognitoId, propertyId} = req.params;
        const propertyIdNumber = Number(propertyId);

        const updatedTenant = await prisma.tenant.update({
            where: { cognitoId},
            data:{
                favorites:{
                    disconnect: {id: propertyIdNumber}
                }
            },
            include: {favorites: true}
        })
        res.json(updatedTenant)
        
    }
     catch (error: any) {
        res.status(500).json({ message : `Error in removing tenants favorite property: ${ error.message }` });
    }
}