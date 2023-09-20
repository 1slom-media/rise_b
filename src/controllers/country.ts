import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { CountryEntity } from '../entities/country';
import path from 'path';
import fs from 'fs';

class CountryController {
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(CountryEntity).find({
            relations: {
                company: true
            }
        }));
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(CountryEntity).find({
            where: { id: +id },
            relations: {
                company: true
            }
        }));
    }

    public async Post(req: Request, res: Response) {
        try {
            const { country_uz, country_en, country_ru, country_tr } = req.body
            const { filename } = req.file;
            const image = filename

            const country = await AppDataSource.getRepository(CountryEntity).createQueryBuilder().insert().into(CountryEntity).values({ country_uz, country_en, country_ru, country_tr, image }).returning("*").execute()

            res.json({
                status: 201,
                message: "country created",
                data: country.raw[0]
            })
        } catch (error) {
            console.log(error);
        }

    }

    public async Put(req: Request, res: Response) {
        try {
            const { country_uz, country_en, country_ru, country_tr } = req.body
            const { id } = req.params
            const { filename } = req.file;

            // old image delete
            const oldData = await AppDataSource.getRepository(CountryEntity).findOne({ where: { id: +id } })
            if(oldData){
                const imageToDelete = oldData?.image;
                const imagePath = path.join(process.cwd(), 'uploads', imageToDelete);
                fs.unlinkSync(imagePath);
            }else{
                console.log("xato");
            }

            // new image 
            const image = filename

            const country = await AppDataSource.getRepository(CountryEntity).createQueryBuilder().update(CountryEntity)
                .set({ country_uz, country_en, country_ru, country_tr, image })
                .where({ id })
                .returning("*")
                .execute()

            res.json({
                status: 200,
                message: "country updated",
                data: country.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }

    public async Delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            const oldData = await AppDataSource.getRepository(CountryEntity).findOne({ where: { id: +id } })
            if(oldData){
                const imageToDelete = oldData?.image;
                const imagePath = path.join(process.cwd(), 'uploads', imageToDelete);
                fs.unlinkSync(imagePath);
            }else{
                console.log("xato");
            }
            const country = await AppDataSource.getRepository(CountryEntity).createQueryBuilder().delete().from(CountryEntity).where({ id }).returning("*").execute()

            res.json({
                status: 200,
                message: "country deleted",
                data: country.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default new CountryController();