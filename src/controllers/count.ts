import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { ProductsEntity } from '../entities/products';
import { UsersEntity } from '../entities/users';
import { CompanyEntity } from '../entities/company';
import { OrdersEntity } from '../entities/order';

class CountController {
    public async Products(req: Request, res: Response): Promise<void> {
        const { company } = req.query
        let query = AppDataSource.getRepository(ProductsEntity)
            .createQueryBuilder('products')
            .leftJoinAndSelect('products.company', 'company');

        if (company && +company > 0) {
            query = query.andWhere('company.id = :company_id', { company_id: company });
        }

        const productList = await query.getMany();
        res.json({ count: productList.length });
    }

    public async Users(req: Request, res: Response): Promise<void> {
        let query = AppDataSource.getRepository(UsersEntity)
            .createQueryBuilder('users');

        const userList = await query.getMany();
        res.json({
            count: userList.length
        });
    }

    public async Companies(req: Request, res: Response): Promise<void> {
        let query = AppDataSource.getRepository(CompanyEntity)
            .createQueryBuilder('company');

        const companyList = await query.getMany();
        res.json({
            count: companyList.length
        });
    }

    public async Orders(req: Request, res: Response): Promise<void> {
        const { company, status } = req.query
        let query = AppDataSource.getRepository(OrdersEntity)
            .createQueryBuilder('orders')
            .leftJoinAndSelect('orders.company', 'company');

        if (company && +company > 0) {
            query = query.andWhere('company.id = :company_id', { company_id: company });
        }

        if (status && +status.length > 1) {
            query = query.andWhere("orders.status = :status", { status: status });
        }

        const ordersList = await query.getMany();
        let totalPriceSum = 0;
        for (const order of ordersList) {
            totalPriceSum += +order.total_price;
        }
        res.json({ count: ordersList.length,price:totalPriceSum });
    }
}

export default new CountController();