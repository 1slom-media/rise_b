import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { KeysEntity } from "../entities/keys";

class KeysController {
  public async Post(req: Request, res: Response) {
    let { keys_uz, keys_en, keys_ru, keys_tr, sub_category } = req.body;
    keys_uz = keys_uz.toLowerCase();
    keys_en = keys_en.toLowerCase();
    keys_ru = keys_ru.toLowerCase();
    keys_tr = keys_tr.toLowerCase();

    const keys = await AppDataSource.getRepository(KeysEntity)
      .createQueryBuilder()
      .insert()
      .into(KeysEntity)
      .values({
        keys_uz,
        keys_en,
        keys_ru,
        keys_tr,
        sub_category,
      })
      .returning("*")
      .execute();

    res.json({
      status: 201,
      message: "keys created",
      data: keys.raw[0],
    });
  }

  public async Put(req: Request, res: Response) {
    try {
      let { keys_uz, keys_en, keys_ru, keys_tr, sub_category } = req.body;
      const { id } = req.params;

      const findKeys = await AppDataSource.getRepository(KeysEntity).findOne({
        where: { id: +id },
        relations: {
          sub_category: true,
        },
      });

      if (findKeys) {
        keys_uz = keys_uz.toLowerCase();
        keys_en = keys_en.toLowerCase();
        keys_ru = keys_ru.toLowerCase();
        keys_tr = keys_tr.toLowerCase();

        findKeys.keys_uz = keys_uz != undefined ? keys_uz : findKeys.keys_uz;
        findKeys.keys_en = keys_en != undefined ? keys_en : findKeys.keys_en;
        findKeys.keys_ru = keys_ru != undefined ? keys_ru : findKeys.keys_ru;
        findKeys.keys_tr = keys_tr != undefined ? keys_tr : findKeys.keys_tr;
        findKeys.sub_category =
          sub_category != undefined ? sub_category : findKeys.sub_category?.id;
        await AppDataSource.manager.save(findKeys);
        res.json({
          status: 200,
          message: "keys updated",
          data: findKeys,
        });
      } else {
        res.json({
          status: 404,
          message: "keys not found",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async Delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const keys = await AppDataSource.getRepository(KeysEntity)
        .createQueryBuilder()
        .delete()
        .from(KeysEntity)
        .where({ id })
        .returning("*")
        .execute();

      res.json({
        status: 200,
        message: "keys deleted",
        data: keys.raw[0],
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new KeysController();
