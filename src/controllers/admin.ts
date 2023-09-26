import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { hashed } from '../utils/hashed';
import { sign } from '../utils/jwt';
import { compare } from '../utils/compare';
import { AdminEntity } from '../entities/admin';
import path from 'path';
import fs from 'fs';

class StaffController {
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(AdminEntity).find({
            order: { id: "ASC" },
            relations: {
                company: true,
            }
        }));
    }

    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(AdminEntity).find({
            order: { id: "ASC" },
            relations: {
                company: true,
            }, where: { id: +id }
        }));
    }

    public async Post(req: Request, res: Response) {
        let { name, surname, phone, email, password, role, company } = req.body
        const { filename } = req.file;
        const image = filename
        password = await hashed(password);

        const foundAdmin = await AppDataSource.getRepository(AdminEntity).find({
            relations: {
                company: true
            }, where: { email }
        })

        if (!foundAdmin.length) {
            const admin = await AppDataSource.getRepository(AdminEntity).createQueryBuilder().insert().into(AdminEntity).values({ name, surname, phone, email, password, role, image, company }).returning("*").execute()

            res.json({
                status: 201,
                message: "admin created",
                data: admin.raw[0]
            })
        }else {
            return res.json({ status: 400, message: 'Email is unique!? This email has already been registered' })
        }
    }

    public async SignIn(req: Request, res: Response) {
        try {
            const { email, password } = req.body

            const foundAdmin = await AppDataSource.getRepository(AdminEntity).findOne({
                relations: {
                    company: true
                }, where: { email }
            })
            if (foundAdmin) {
                if (await compare(password, foundAdmin.password) == true) {
                    return res.json({
                        status: 200,
                        message: "Admin login successful",
                        token: sign({ id: foundAdmin.id }),
                        data: foundAdmin
                    })
                } else {
                    res.status(401).json({
                        status: 401,
                        message: "wrong email or password",
                        token: null,
                    })
                }
            } else {
                res.status(401).json({
                    status: 401,
                    message: "wrong email or password",
                    token: null,
                })
            }

        } catch (error) {
            console.log(error);
        }
    }

    public async Put(req: Request, res: Response) {
        try {
            let { name, surname, phone, email, password, role, company } = req.body
            const { id } = req.params
            let image;
            if(req.file){
                const { filename } = req.file;
                image=filename
            }
            password = await hashed(password);

            // old image delete
            const oldData = await AppDataSource.getRepository(AdminEntity).findOne({ where: { id: +id } })
            if (oldData && image) {
                const imageToDelete = oldData?.image;
                const imagePath = path.join(process.cwd(), 'uploads', imageToDelete);
                fs.unlinkSync(imagePath);
            } else {
                console.log("xato");
            }

            oldData.email = email != "" ? email : oldData.email
            oldData.role = role != "" ? role : oldData.role
            oldData.image = image != undefined ? image : oldData.image
            oldData.company = company != "" ? company : oldData.company
            oldData.phone = phone != "" ? phone : oldData.phone
            oldData.password = password != "" ? password : oldData.password
            oldData.name = name != "" ? name : oldData.name
            oldData.surname = surname != "" ? surname : oldData.surname

            await AppDataSource.manager.save(oldData)

            res.json({
                status: 200,
                message: "admin updated",
                data: oldData
            })
        } catch (error) {
            console.log(error);
        }
    }

}

export default new StaffController();

