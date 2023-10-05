import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import path from 'path';
import fs from 'fs';
import { ParametrsEntity } from '../entities/parametrs';

class ParametrsController {
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(ParametrsEntity).find({
            relations: {
                products: true,
                cart:true
            }
        }));
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(ParametrsEntity).find({
            where: { id: +id }, relations: {
                products: true,
                cart:true
            }
        }));
    }

    public async Post(req: Request, res: Response) {
        try {
            const { color, count, products } = req.body
            const { image1, image2, image3, image4 } = req.files as { [fieldname: string]: Express.Multer.File[] };

            const image1Filename = image1[0].filename;
            const image2Filename = image2[0].filename;
            const image3Filename = image3[0].filename;
            const image4Filename = image4[0].filename;

            const parametrs = new ParametrsEntity()

            parametrs.color = color
            parametrs.count = count
            parametrs.products = products
            parametrs.image1 = image1Filename
            parametrs.image2 = image2Filename
            parametrs.image3 = image3Filename
            parametrs.image4 = image4Filename

            await AppDataSource.manager.save(parametrs)

            res.json({
                status: 201,
                message: "parametrs created",
                data: parametrs
            })
        } catch (error) {
            console.log(error);
        }

    }

    public async Put(req: Request, res: Response) {
        try {
            const { color, count, products } = req.body
            const { id } = req.params
            const { image1, image2, image3, image4 } = req.files as { [fieldname: string]: Express.Multer.File[] };

            // old image delete
            const oldData = await AppDataSource.getRepository(ParametrsEntity).findOne({ where: { id: +id },relations:{products:true} })
            if (oldData) {
                const imageFields = ['image1', 'image2', 'image3', 'image4'];
                const imageFilenames = [image1, image2, image3, image4].map((image) => image ? image[0]?.filename : undefined);

                for (let i = 0; i < imageFields.length; i++) {
                    const field = imageFields[i];
                    const filename = imageFilenames[i];

                    if (filename) {
                        // Delete old image
                        const oldImageToDelete = oldData[field];
                        if (oldImageToDelete) {
                            const imagePath = path.join(process.cwd(), 'uploads', oldImageToDelete);
                            fs.unlinkSync(imagePath);
                        }
                        // Update with new image
                        oldData[field] = filename;
                    }
                }
            }

            // new image 

            oldData.color = color != "" ? color : oldData.color;
            oldData.count = count != "" ? count : oldData.count;
            oldData.products = products != "" ? products : oldData?.products.id;
            oldData.image1 = image1 != undefined ? image1[0]?.filename : oldData.image1
            oldData.image2 = image2 != undefined ? image2[0]?.filename : oldData.image2
            oldData.image3 = image3 != undefined ? image3[0]?.filename : oldData.image3
            oldData.image4 = image4 != undefined ? image4[0]?.filename : oldData.image4
            
            await AppDataSource.manager.save(oldData)

            res.json({
                status: 200,
                message: "category updated",
                data: oldData
            })
        } catch (error) {
            console.log(error);
        }
    }

    public async Delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            const oldData = await AppDataSource.getRepository(ParametrsEntity).findOne({ where: { id: +id } })
            if (oldData) {
                const image1ToDelete = oldData?.image1;
                const image2ToDelete = oldData?.image2;
                const image3ToDelete = oldData?.image3;
                const image4ToDelete = oldData?.image4;
                const image1Path = path.join(process.cwd(), 'uploads', image1ToDelete);
                const image2Path = path.join(process.cwd(), 'uploads', image2ToDelete);
                const image3Path = path.join(process.cwd(), 'uploads', image3ToDelete);
                const image4Path = path.join(process.cwd(), 'uploads', image4ToDelete);
                fs.unlinkSync(image1Path)
                fs.unlinkSync(image2Path)
                fs.unlinkSync(image3Path)
                fs.unlinkSync(image4Path)
            } else {
                console.log("xato");
            }
            const parametrs = await AppDataSource.getRepository(ParametrsEntity).createQueryBuilder().delete().from(ParametrsEntity).where({ id }).returning("*").execute()

            res.json({
                status: 200,
                message: "parametrs deleted",
                data: parametrs.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default new ParametrsController();