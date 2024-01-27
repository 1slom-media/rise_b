import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { MessagesEntity } from '../entities/messages';

class MessagesController {
    public async Get(req: Request, res: Response): Promise<void> {
        const { userId } = req.query;
        if (userId && +userId > 0) {
            const messages = await AppDataSource.getRepository(MessagesEntity).find({
                order: { id: "ASC" }, relations: {
                    users: true,
                    admin: true
                }
            })

            res.json(messages.filter(message => message.users.id === +userId));
        } else {
            res.json(await AppDataSource.getRepository(MessagesEntity).find({
                order: { id: "ASC" }, relations: {
                    users: true,
                    admin: true
                }
            }));
        }
    }
    public async GetNotRead(req: Request, res: Response): Promise<void> {
        const { userId } = req.query;
        if (userId && +userId > 0) {
            const messages = await AppDataSource.getRepository(MessagesEntity).find({
                order: { id: "ASC" }, relations: {
                    users: true,
                    admin: true
                }, where: { status: "not_read" }
            })

            res.json(messages.filter(message => message.users.id === +userId));
        } else {
            res.json(await AppDataSource.getRepository(MessagesEntity).find({
                order: { id: "ASC" }, relations: {
                    users: true,
                    admin: true
                }, where: { status: "not_read" }
            }));
        }
    }
    public async GetRead(req: Request, res: Response): Promise<void> {
        const { userId } = req.query;
        if (userId && +userId > 0) {
            const messages = await AppDataSource.getRepository(MessagesEntity).find({
                order: { id: "ASC" }, relations: {
                    users: true,
                    admin: true
                }, where: { status: "read" }
            })

            res.json(messages.filter(message => message.users.id === +userId));
        } else {
            res.json(await AppDataSource.getRepository(MessagesEntity).find({
                order: { id: "ASC" }, relations: {
                    users: true,
                    admin: true
                }, where: { status: "read" }
            }));
        }
    }
    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(MessagesEntity).find({
            where: { id: +id }, relations: {
                users: true,
                admin: true
            }
        }));
    }
    public async Post(req: Request, res: Response) {
        const { message, admin, users } = req.body

        const messages = await AppDataSource.getRepository(MessagesEntity).createQueryBuilder().insert().into(MessagesEntity).values({ message, admin, users }).returning("*").execute()

        res.json({
            status: 201,
            message: "messages created",
            data: messages.raw[0]
        })
    }
    public async Put(req: Request, res: Response) {
        try {
            const { message, admin, users } = req.body
            const { id } = req.params

            const messages = await AppDataSource.getRepository(MessagesEntity).findOne({ where: { id: +id }, relations: { users: true, admin: true } })

            messages.message = message != undefined ? message : messages.message
            messages.admin = admin != undefined ? admin : messages.admin?.id
            messages.users = users != undefined ? users : messages.users?.id

            await AppDataSource.manager.save(messages)
            res.json({
                status: 200,
                message: "messages updated",
                data: messages
            })
        } catch (error) {
            console.log(error);
        }
    }

    public async Delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            const messages = await AppDataSource.getRepository(MessagesEntity).createQueryBuilder().update(MessagesEntity)
                .set({ status: "read" })
                .where({ id })
                .returning("*")
                .execute()

            res.json({
                status: 200,
                message: "messages readed",
                data: messages.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default new MessagesController();