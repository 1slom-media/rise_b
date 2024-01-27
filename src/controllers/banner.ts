import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import path from 'path';
import fs from 'fs';
import { BannerEntity } from '../entities/banner';

class BannerController {
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(BannerEntity).find({
            order: { id: "ASC" },relations:{
                sub_category:true
            }
        }));
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(BannerEntity).find({
            where: { id: +id },relations:{
                sub_category:true
            }
        }));
    }

    public async Post(req: Request, res: Response) {
        const { status,sub_category } = req.body
        const { filename } = req?.file;
        const image = filename

        const banner = await AppDataSource.getRepository(BannerEntity).createQueryBuilder().insert().into(BannerEntity).values({ status,sub_category, image }).returning("*").execute()

        res.json({
            status: 201,
            message: "banner created",
            data: banner.raw[0]
        })
    }

    public async Put(req: Request, res: Response) {
        try {
            const { status,sub_category } = req.body
            const { id } = req.params
            let image;
            if (req.file) {
                const { filename } = req.file;
                image = filename
            }

            // old image delete
            const oldData = await AppDataSource.getRepository(BannerEntity).findOne({ where: { id: +id } })
            if (oldData && image) {
                const imageToDelete = oldData?.image;
                const imagePath = path.join(process.cwd(), 'uploads', imageToDelete);
                fs.unlinkSync(imagePath);
            } else {
                console.log("xato");
            }

            
            oldData.status = status != "" ? status : oldData.status
            oldData.sub_category = sub_category != "" ? sub_category : oldData.sub_category
            oldData.image = image != undefined ? image : oldData.image

            await AppDataSource.manager.save(oldData)
            res.json({
                status: 200,
                message: "banner updated",
                data: oldData
            })
        } catch (error) {
            console.log(error);
        }
    }

    public async Delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            const banner = await AppDataSource.getRepository(BannerEntity).createQueryBuilder().delete().from(BannerEntity).where({ id }).returning("*").execute()

            res.json({
                status: 200,
                message: "banner deleted",
                data: banner.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default new BannerController();