import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import path from 'path';
import fs from 'fs';
import { CompanyEntity } from '../entities/company';

class CompanyController {
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(CompanyEntity).find({
            relations: {
                country:true,
                admin:true,
                products:true
            }
        }));
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(CompanyEntity).find({
            where: { id: +id },
            relations: {
                country:true,
                admin:true,
                products:true
            }
        }));
    }

    public async Post(req: Request, res: Response) {
        try {
            const { company,country } = req.body
            const { filename } = req.file;
            const image = filename

            const companies = await AppDataSource.getRepository(CompanyEntity).createQueryBuilder().insert().into(CompanyEntity).values({ company,country, image }).returning("*").execute()

            res.json({
                status: 201,
                message: "companies created",
                data: companies.raw[0]
            })
        } catch (error) {
            console.log(error);
        }

    }

    public async Put(req: Request, res: Response) {
        try {
            const { company,country } = req.body
            const { id } = req.params
            let image;
            if(req.file){
                const { filename } = req.file;
                image=filename
            }

            // old image delete
            const oldData = await AppDataSource.getRepository(CompanyEntity).findOne({ where: { id: +id } })
            if(oldData && image){
                const imageToDelete = oldData?.image;
                const imagePath = path.join(process.cwd(), 'uploads', imageToDelete);
                fs.unlinkSync(imagePath);
            }else{
                console.log("xato");
            }

            oldData.company = company != "" ? company : oldData.company
            oldData.country = country != "" ? country : oldData.country
            oldData.image = image != undefined ? image : oldData.image

            await AppDataSource.manager.save(oldData)
            res.json({
                status: 200,
                message: "companies updated",
                data: oldData
            })
        } catch (error) {
            console.log(error);
        }
    }

    public async Delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            const oldData = await AppDataSource.getRepository(CompanyEntity).findOne({ where: { id: +id } })
            if(oldData){
                const imageToDelete = oldData?.image;
                const imagePath = path.join(process.cwd(), 'uploads', imageToDelete);
                fs.unlinkSync(imagePath);
            }else{
                console.log("xato");
            }
            const companies = await AppDataSource.getRepository(CompanyEntity).createQueryBuilder().delete().from(CompanyEntity).where({ id }).returning("*").execute()

            res.json({
                status: 200,
                message: "companies deleted",
                data: companies.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default new CompanyController();