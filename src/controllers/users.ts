import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { sign } from "../utils/jwt";
import { compare } from "../utils/compare";
import redis from "../utils/redis";
import randomNum from "../utils/randomNum";
import { hashed } from "../utils/hashed";
import { UsersEntity } from "../entities/users";
import Mail from "../utils/nodemailer";
import passport from "../utils/gf";
import sms from "../utils/sms";

class UsersController {
  // get all
  public async Get(req: Request, res: Response): Promise<void> {
    res.json(
      await AppDataSource.getRepository(UsersEntity).find({
        order: { id: "ASC" },
        relations: {
          cart: true,
          orders: true,
        },
      })
    );
  }

  // get id
  public async GetId(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    res.json(
      await AppDataSource.getRepository(UsersEntity).find({
        where: { id: +id },
        relations: {
          cart: true,
          orders: true,
        },
      })
    );
  }

  public async SignGoogle(req: Request, res: Response): Promise<void> {
    const { email, name, surname } = req.body;
    const foundUser = await AppDataSource.getRepository(UsersEntity).findOne({
      where: { email },
    });
    const isWeb = true;
    if (foundUser == null) {
      const newUser = await AppDataSource.getRepository(UsersEntity)
        .createQueryBuilder()
        .insert()
        .into(UsersEntity)
        .values({ email, name, surname, isWeb })
        .returning("*")
        .execute();

      res.status(200).json({
        status: 200,
        message: "User info from Google",
        data: newUser.raw[0],
        token: sign({ id: newUser.raw[0]?.id }),
      });
    } else {
      res.status(200).json({
        success: true,
        message: "successful",
        data: foundUser,
        token: sign({ id: foundUser.id }),
      });
    }
  }

  // signup phone
  public async SignUpPhone(req: Request, res: Response) {
    const { name, surname, phone } = req.body;
    if (!(phone === "998912223344")) {
      const foundUser = await AppDataSource.getRepository(UsersEntity).find({
        where: { phone },
      });

      const User = await AppDataSource.getRepository(UsersEntity).findOne({
        where: { phone },
      });

      if (!foundUser.length) {
        const user = await AppDataSource.getRepository(UsersEntity)
          .createQueryBuilder()
          .insert()
          .into(UsersEntity)
          .values({ name, surname, phone })
          .returning("*")
          .execute();
        const code = randomNum();
        redis.set(phone, code, "EX", 120);
        sms.send(
          phone,
          `Для завершения процедуры регистрации на https://rise-shopping.uz пожалуйста, введите код: ${code}`
        );
        return res.json({
          status: 201,
          message: "your code sent",
          data: user.raw[0],
          code: code,
        });
      }
      if (
        (foundUser.length && User?.isMobile === false) ||
        User.isWeb === false
      ) {
        const code = randomNum();
        redis.set(phone, code, "EX", 120);
        sms.send(
          phone,
          `Для завершения процедуры регистрации на https://rise-shopping.uz пожалуйста, введите код: ${code}`
        );
        return res.json({
          status: 201,
          message: "your code sent",
          code: code,
        });
      } else {
        return res.json({
          status: 400,
          message: "Phone is unique!? This phone has already been registered",
        });
      }
    } else {
      const user = await AppDataSource.getRepository(UsersEntity).findOne({
        where: { phone },
      });
      return res.json({
        status: 200,
        message: "its test phone",
        data: user,
        code: "10101",
      });
    }
  }

  // verify phone
  public async VerifyPhone(req: Request, res: Response) {
    const { phone, code, isWeb, isMobile } = req.body;
    const foundUser = await AppDataSource.getRepository(UsersEntity).findOne({
      where: { phone },
    });
    if (phone === "998912223344" && code === "10101") {
      if (isMobile) {
        foundUser.isMobile = true;
      }
      if (isWeb) {
        foundUser.isWeb = true;
      }
      await AppDataSource.manager.save(foundUser);
      return res.status(200).json({
        status: 200,
        message: "Congratulations, you have successfully registered",
        token: sign({ id: foundUser.id }),
        data: foundUser,
      });
    } else {
      if (foundUser) {
        const redisCode = await redis.get(phone);
        if (redisCode && redisCode == code) {
          if (isMobile) {
            foundUser.isMobile = true;
          }
          if (isWeb) {
            foundUser.isWeb = true;
          }
          await AppDataSource.manager.save(foundUser);

          return res.status(200).json({
            status: 200,
            message: "Congratulations, you have successfully registered",
            token: sign({ id: foundUser.id }),
            data: foundUser,
          });
        } else {
          return res.status(400).json({ status: 400, message: "Invalid code" });
        }
      } else {
        res.json({ status: 400, message: "Phone not found" });
      }
    }
  }

  // resend phone
  public async ResendCodePhone(req: Request, res: Response) {
    const { phone } = req.body;

    const foundUser = await AppDataSource.getRepository(UsersEntity).findOne({
      where: { phone },
    });
    const oldCode = await redis.del(phone);
    if (
      (foundUser && foundUser.isMobile === false) ||
      foundUser.isWeb === false
    ) {
      const code = randomNum();
      redis.set(phone, code, "EX", 120);
      sms.send(
        phone,
        `Для завершения процедуры регистрации на https://rise-shopping.uz пожалуйста, введите код: ${code}`
      );
      res.json({
        status: 201,
        message: "Your code sent",
      });
    } else {
      res.json({
        status: 400,
        message:
          "Your phone is already registered. You can access your account by logging in ",
      });
    }
  }

  // sign phone
  public async SignInPhone(req: Request, res: Response) {
    try {
      const { phone, password } = req.body;

      const foundUser = await AppDataSource.getRepository(UsersEntity).findOne({
        where: { phone },
      });

      if (foundUser && (await compare(password, foundUser.password)) == true) {
        return res.json({
          status: 200,
          message: "User login successful",
          token: sign({ id: foundUser.id }),
          data: foundUser,
        });
      } else {
        res.status(401).json({
          status: 401,
          message: "wrong phone or password",
          token: null,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // signup email
  public async SignUpEmail(req: Request, res: Response) {
    const { name, surname, email } = req.body;

    const foundUser = await AppDataSource.getRepository(UsersEntity).find({
      where: { email },
    });

    const User = await AppDataSource.getRepository(UsersEntity).findOne({
      where: { email },
    });

    if (!foundUser.length) {
      const user = await AppDataSource.getRepository(UsersEntity)
        .createQueryBuilder()
        .insert()
        .into(UsersEntity)
        .values({ name, surname, email })
        .returning("*")
        .execute();
      const code = randomNum();
      redis.set(email, code, "EX", 120);
      Mail({
        from: {
          name: "Rise Development",
          address: "islombektagayev1@gmail.com",
        }, // sender address
        to: email, // list of receivers
        subject: `Rise verification code ✔`, // Subject line
        html: `Для завершения процедуры регистрации на https://rise-shopping.uz пожалуйста, введите код: <b>${code}</b>`, // html body
      });
      return res.json({
        status: 201,
        message: "your code sent",
        data: user.raw[0],
        code: code,
      });
    }
    if (
      (foundUser.length && User?.isMobile === false) ||
      User.isWeb === false
    ) {
      const code = randomNum();
      redis.set(email, code, "EX", 120);
      Mail({
        from: {
          name: "Rise Development",
          address: "islombektagayev1@gmail.com",
        }, // sender address
        to: email, // list of receivers
        subject: `Rise verification code ✔`, // Subject line
        html: `Для завершения процедуры регистрации на https://rise-shopping.uz пожалуйста, введите код: <b>${code}</b>`, // html body
      });
      return res.json({
        status: 201,
        message: "your code sent",
        code: code,
      });
    } else {
      return res.json({
        status: 400,
        message: "Email is unique!? This email has already been registered",
      });
    }
  }

  // verify email
  public async VerifyEmail(req: Request, res: Response) {
    const { email, code, isMobile, isWeb } = req.body;

    const foundUser = await AppDataSource.getRepository(UsersEntity).findOne({
      where: { email },
    });

    if (foundUser) {
      const redisCode = await redis.get(email);
      if (redisCode && redisCode == code) {
        if (isMobile) {
          foundUser.isMobile = true;
        }
        if (isWeb) {
          foundUser.isWeb = true;
        }
        await AppDataSource.manager.save(foundUser);

        return res.status(200).json({
          status: 200,
          message: "Congratulations, you have successfully registered",
          token: sign({ id: foundUser.id }),
          data: foundUser,
        });
      } else {
        return res.status(400).json({ status: 400, message: "Invalid code" });
      }
    } else {
      res.json({ status: 400, message: "Email not found" });
    }
  }

  // sign email
  public async SignInEmail(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const foundUser = await AppDataSource.getRepository(UsersEntity).findOne({
        where: { email },
      });

      if (foundUser && (await compare(password, foundUser.password)) == true) {
        return res.json({
          status: 200,
          message: "User login successful",
          token: sign({ id: foundUser.id }),
          data: foundUser,
        });
      } else {
        res.status(401).json({
          status: 401,
          message: "wrong email or password",
          token: null,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // resend email
  public async ResendCodeEmail(req: Request, res: Response) {
    const { email } = req.body;

    const foundUser = await AppDataSource.getRepository(UsersEntity).findOne({
      where: { email },
    });
    const oldCode = await redis.del(email);
    if (
      (foundUser && foundUser.isMobile === false) ||
      foundUser.isWeb === false
    ) {
      const code = randomNum();
      redis.set(email, code, "EX", 120);
      Mail({
        from: {
          name: "Rise Development",
          address: "islombektagayev1@gmail.com",
        }, // sender address
        to: email, // list of receivers
        subject: `Rise verification code ✔`, // Subject line
        html: `Для завершения процедуры регистрации на https://rise-shopping.uz пожалуйста, введите код: <b>${code}</b>`, // html body
      });
      res.json({
        status: 201,
        message: "Your code sent",
      });
    } else {
      res.json({
        status: 400,
        message:
          "Your email is already registered. You can access your account by logging in ",
      });
    }
  }

  // put and create password
  public async Put(req: Request, res: Response) {
    try {
      const { id } = req.params;
      let { email, phone, password, name, surname, long, lat } = req.body;

      if (password) {
        password = await hashed(password);
      }

      const user = await AppDataSource.getRepository(UsersEntity).findOneBy({
        id: +id,
      });

      user.email = email != undefined ? email : user.email;
      user.phone = phone != undefined ? phone : user.phone;
      user.password = password != undefined ? password : user.password;
      user.name = name != undefined ? name : user.name;
      user.surname = surname != undefined ? surname : user.surname;
      user.long = long != undefined ? long : user.long;
      user.lat = lat != undefined ? lat : user.lat;

      await AppDataSource.manager.save(user);

      res.json({
        status: 200,
        message: "user data updated",
        data: user,
      });
    } catch (error) {
      res.json({
        status: 400,
        message: error?.message,
      });
    }
  }

  // forgot password
  public async ForgotPassword(req: Request, res: Response) {
    try {
      const { email, phone } = req.body;
      const foundUser = await AppDataSource.getRepository(UsersEntity).find({
        where: { email },
      });

      const User = await AppDataSource.getRepository(UsersEntity).findOne({
        where: { email },
      });

      const UserPhone = await AppDataSource.getRepository(UsersEntity).findOne({
        where: { phone },
      });

      const foundUserPhone = await AppDataSource.getRepository(
        UsersEntity
      ).find({
        where: { phone },
      });

      if (email) {
        const user = await AppDataSource.getRepository(UsersEntity)
          .createQueryBuilder()
          .update(UsersEntity)
          .set({ password: null, isWeb: false })
          .where({ email })
          .returning("*")
          .execute();

        if (foundUser.length && User?.isWeb === false) {
          const code = randomNum();
          redis.set(email, code, "EX", 120);
          Mail({
            from: {
              name: "Rise Development",
              address: "islombektagayev1@gmail.com",
            }, // sender address
            to: email, // list of receivers
            subject: `Rise verification code ✔`, // Subject line
            html: `Для завершения процедуры регистрации на https://rise-shopping.uz пожалуйста, введите код:  <b>${code}</b>`, // html body
          });
          return res.json({
            status: 201,
            message: "your code sent",
          });
        }
      }

      if (phone) {
        const user = await AppDataSource.getRepository(UsersEntity)
          .createQueryBuilder()
          .update(UsersEntity)
          .set({ password: null, isWeb: false })
          .where({ phone })
          .returning("*")
          .execute();

        if (foundUserPhone.length && UserPhone?.isWeb === false) {
          const code = randomNum();
          redis.set(phone, code, "EX", 120);
          sms.send(
            phone,
            `Для завершения процедуры регистрации на https://rise-shopping.uz пожалуйста, введите код: ${code}`
          );
          return res.json({
            status: 201,
            message: "your code sent",
          });
        }
      }
    } catch (error) {
      res.json({
        status: 400,
        message: error.message,
      });
    }
  }

  // forgot password
  public async LogOut(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isMobile, isWeb } = req.body;

      const User = await AppDataSource.getRepository(UsersEntity).findOne({
        where: { id: +id },
      });

      if (User && isWeb === false) {
        const user = await AppDataSource.getRepository(UsersEntity)
          .createQueryBuilder()
          .update(UsersEntity)
          .set({ isWeb })
          .where({ id })
          .returning("*")
          .execute();

        res.json({
          status: 200,
          message: "User verifay false",
          data: user.raw[0],
        });
      } else if (User && isMobile === false) {
        const user = await AppDataSource.getRepository(UsersEntity)
          .createQueryBuilder()
          .update(UsersEntity)
          .set({ isMobile })
          .where({ id })
          .returning("*")
          .execute();

        res.json({
          status: 200,
          message: "User verifay false",
          data: user.raw[0],
        });
      } else {
        res.json({
          status: 404,
          message: "User not found",
        });
      }
    } catch (error) {
      res.json({
        status: 400,
        message: error.message,
      });
    }
  }
}

export default new UsersController();
