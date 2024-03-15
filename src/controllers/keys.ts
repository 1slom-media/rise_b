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

  //   public async Put(req: Request, res: Response) {
  //     try {
  //       const {
  //         sub_category_uz,
  //         sub_category_en,
  //         sub_category_ru,
  //         sub_category_tr,
  //         category,
  //       } = req.body;
  //       const { id } = req.params;
  //       let image;
  //       if (req.file) {
  //         const { filename } = req.file;
  //         image = filename;
  //       }

  //       // old image delete
  //       const oldData = await AppDataSource.getRepository(
  //         KeysEntity
  //       ).findOne({
  //         where: { id: +id },
  //         relations: {
  //           category: true,
  //         },
  //       });
  //       if (oldData && image && oldData.image != null) {
  //         const imageToDelete = oldData?.image;
  //         const imagePath = path.join(process.cwd(), "uploads", imageToDelete);
  //         fs.unlinkSync(imagePath);
  //       } else {
  //         console.log("xato");
  //       }

  //       oldData.sub_category_uz =
  //         sub_category_uz != "" ? sub_category_uz : oldData.sub_category_uz;
  //       oldData.sub_category_en =
  //         sub_category_en != "" ? sub_category_en : oldData.sub_category_en;
  //       oldData.sub_category_ru =
  //         sub_category_ru != "" ? sub_category_ru : oldData.sub_category_ru;
  //       oldData.sub_category_tr =
  //         sub_category_tr != "" ? sub_category_tr : oldData.sub_category_tr;
  //       oldData.category = category != "" ? category : oldData.category.id;
  //       oldData.image = image != undefined ? image : oldData.image;

  //       await AppDataSource.manager.save(oldData);
  //       res.json({
  //         status: 200,
  //         message: "subcategory updated",
  //         data: oldData,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   public async Delete(req: Request, res: Response) {
  //     try {
  //       const { id } = req.params;

  //       const sub_category = await AppDataSource.getRepository(KeysEntity)
  //         .createQueryBuilder()
  //         .delete()
  //         .from(KeysEntity)
  //         .where({ id })
  //         .returning("*")
  //         .execute();

  //       res.json({
  //         status: 200,
  //         message: "subcategory deleted",
  //         data: sub_category.raw[0],
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
}

export default new KeysController();
