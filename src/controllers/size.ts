import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { SizeEntity } from '../entities/size';

class SizeController {
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(SizeEntity).find({
            order: { id: "ASC" },
            relations: {
                sub_category: true
            }
        }));
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(SizeEntity).find({
            where: { id: +id },
            relations: {
                sub_category: true
            }
        }));
    }

    public async Post(req: Request, res: Response) {
        const { size, sub_category } = req.body

        const sizes = await AppDataSource.getRepository(SizeEntity).createQueryBuilder().insert().into(SizeEntity).values({ size, sub_category }).returning("*").execute()

        res.json({
            status: 201,
            message: "sizes created",
            data: sizes.raw[0]
        })
    }

    public async Put(req: Request, res: Response) {
        try {
            const { size, sub_category } = req.body
            const { id } = req.params

            const sizes = await AppDataSource.getRepository(SizeEntity).findOneBy({ id: +id })

            sizes.size = size != undefined ? size : sizes.size
            sizes.sub_category = sub_category != undefined ? sub_category : sizes.sub_category

            await AppDataSource.manager.save(sizes)
            res.json({
                status: 200,
                message: "sizes updated",
                data: sizes
            })
        } catch (error) {
            console.log(error);
        }
    }

    public async Delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            const sizes = await AppDataSource.getRepository(SizeEntity).createQueryBuilder().delete().from(SizeEntity).where({ id }).returning("*").execute()

            res.json({
                status: 200,
                message: "sizes deleted",
                data: sizes.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default new SizeController(); 