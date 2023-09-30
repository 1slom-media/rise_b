import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { sign } from '../utils/jwt';
import { compare } from '../utils/compare';
import redis from '../utils/redis';
import randomNum from '../utils/randomNum';
import { hashed } from '../utils/hashed';
import { UsersEntity } from '../entities/users';
import Mail from '../utils/nodemailer';
import passport from '../utils/gf';
import sms from '../utils/sms';

class UsersController {

    // get all
    public async Get(req: Request, res: Response): Promise<void> {
        res.json(await AppDataSource.getRepository(UsersEntity).find({
            order: { id: "ASC" }
        }));
    }

    // get id
    public async GetId(req: Request, res: Response): Promise<void> {
        const { id } = req.params

        res.json(await AppDataSource.getRepository(UsersEntity).find({
            where: { id: +id }
        }));
    }

    public async Succsess(req: Request, res: Response): Promise<void> {
        // Assuming your User type is defined like this
        interface User {
            email: string;
            firstName: string;
            lastName: string;
            picture: string;
            accessToken: string;
        }

        if (req.user) {
            const user = req.user as User

            const { email, firstName, lastName } = user

            const foundUser = await AppDataSource.getRepository(UsersEntity).findOne({
                where: { email }
            })

            const name = firstName;
            const surname = lastName;
            const verify = true    

            if (foundUser==null) {
                const newUser = await AppDataSource.getRepository(UsersEntity).createQueryBuilder().insert().into(UsersEntity).values({ email, name, surname, verify }).returning("*").execute()

                res.status(200).json({
                    status: 200,
                    message: 'User info from Google',
                    user: newUser.raw[0],
                    token: sign({ id: newUser.raw[0]?.id }),
                });

            } else {
                res.status(200).json({
                    success: true,
                    message: 'successful',
                    user: foundUser,
                    token: sign({ id: foundUser.id })
                });
            }

        }
    }

    public async Failed(req: Request, res: Response): Promise<void> {
        res.status(401).json({
            success: false,
            message: 'failure',
        });
    }

    public async LogOut(req: Request, res: Response, next: NextFunction): Promise<void> {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('https://rise-shopping.uz');
            // res.redirect('http://localhost:3000');
        });
    }

    public async GoogleAuth(req: Request, res: Response): Promise<void> {
        passport.authenticate('google', { scope: ['email', 'profile'] })(req, res)
    }

    public async GoogleCallback(req: Request, res: Response): Promise<void> {
        passport.authenticate('google', (err, user: any, info) => {
            if (err) {
                console.error('Error during Google authentication:', err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            if (!user) {
                console.error('Google authentication failed:', info);
                return res.status(401).json({ success: false, message: 'Authentication failed' });
            }

            // If authentication is successful, log in the user or redirect as needed
            req.logIn(user, (loginErr) => {
                if (loginErr) {
                    console.error('Error during user login:', loginErr);
                    return res.status(500).json({ success: false, message: 'Internal server error' });
                }

                // Redirect or respond as needed
                res.redirect('https://rise-shopping.uz');
                // res.redirect('http://localhost:3000');
            });
        })(req, res);
    }



    // signup phone
    public async SignUpPhone(req: Request, res: Response) {
        const { phone } = req.body

        const foundUser = await AppDataSource.getRepository(UsersEntity).find({
            where: { phone }
        })

        const User = await AppDataSource.getRepository(UsersEntity).findOne({
            where: { phone }
        })

        if (!foundUser.length) {
            const user = await AppDataSource.getRepository(UsersEntity).createQueryBuilder().insert().into(UsersEntity).values({ phone }).returning("*").execute()
            const code = randomNum();
            redis.set(phone, code, 'EX', 120);
            sms.send(phone, `Welcome ! We appreciate your interest in our service. Your Rise verification code ✔:${code}`)
            return res.json({
                status: 201,
                message: "your code sent",
                data: user.raw[0]
            })
        } if (foundUser.length && User?.verify === false) {
            const code = randomNum();
            redis.set(phone, code, 'EX', 120);
            sms.send(phone, `Welcome ! We appreciate your interest in our service. Your Rise verification code ✔:${code}`)
            return res.json({
                status: 201,
                message: "your code sent"
            })
        } else {
            return res.json({ status: 400, message: 'Phone is unique!? This phone has already been registered' })
        }

    }

    // verify phone
    public async VerifyPhone(req: Request, res: Response) {
        const { phone, code } = req.body

        const foundUser = await AppDataSource.getRepository(UsersEntity).findOne({
            where: { phone }
        })

        if (foundUser) {
            const redisCode = await redis.get(phone)
            if (redisCode && redisCode == code) {
                foundUser.verify = true
                await AppDataSource.manager.save(foundUser)

                return res
                    .status(200)
                    .json({
                        status: 200,
                        message: 'Congratulations, you have successfully registered',
                        token: sign({ id: foundUser.id }),
                        user: foundUser
                    });
            } else {
                return res.status(400).json({ status: 400, message: 'Invalid code' });
            }
        } else {
            res.json({ status: 400, message: 'Phone not found' })
        }

    }

    // resend phone
    public async ResendCodePhone(req: Request, res: Response) {
        const { phone } = req.body

        const foundUser = await AppDataSource.getRepository(UsersEntity).findOne({
            where: { phone }
        })
        const oldCode = await redis.del(phone);
        if (foundUser && foundUser.verify === false) {
            const code = randomNum();
            redis.set(phone, code, 'EX', 120);
            sms.send(phone, `Welcome ! We appreciate your interest in our service. Your Rise verification code ✔:${code}`)
            res.json({
                status: 201,
                message: "Your code sent",
            })
        } else {
            res.json({ status: 400, message: 'Your phone is already registered. You can access your account by logging in ' })
        }

    }

    // sign phone
    public async SignInPhone(req: Request, res: Response) {
        try {
            const { phone, password } = req.body

            const foundUser = await AppDataSource.getRepository(UsersEntity).findOne({
                where: { phone }
            })

            if (foundUser && await compare(password, foundUser.password) == true) {
                return res.json({
                    status: 200,
                    message: "User login successful",
                    token: sign({ id: foundUser.id }),
                    data: foundUser
                })

            } else {
                res.status(401).json({
                    status: 401,
                    message: "wrong phone or password",
                    token: null,
                })
            }

        } catch (error) {
            console.log(error);
        }
    }

    // signup email
    public async SignUpEmail(req: Request, res: Response) {
        const { email } = req.body

        const foundUser = await AppDataSource.getRepository(UsersEntity).find({
            where: { email }
        })

        const User = await AppDataSource.getRepository(UsersEntity).findOne({
            where: { email }
        })

        if (!foundUser.length) {
            const user = await AppDataSource.getRepository(UsersEntity).createQueryBuilder().insert().into(UsersEntity).values({ email }).returning("*").execute()
            const code = randomNum();
            redis.set(email, code, 'EX', 120);
            Mail({
                from: {
                    name: "Rise Development",
                    address: "islombektagayev1@gmail.com"
                }, // sender address
                to: email, // list of receivers
                subject: `Rise verification code ✔`, // Subject line
                html: `Welcome ! We appreciate your interest in our service. Your verification code: <br/> <br/> <b>${code}</b>`, // html body
            });
            return res.json({
                status: 201,
                message: "your code sent",
                data: user.raw[0]
            })
        } if (foundUser.length && User?.verify === false) {
            const code = randomNum();
            redis.set(email, code, 'EX', 120);
            Mail({
                from: {
                    name: "Rise Development",
                    address: "islombektagayev1@gmail.com"
                }, // sender address
                to: email, // list of receivers
                subject: `Rise verification code ✔`, // Subject line
                html: `Welcome ! We appreciate your interest in our service. Your verification code: <br/> <br/> <b>${code}</b>`, // html body
            });
            return res.json({
                status: 201,
                message: "your code sent"
            })
        } else {
            return res.json({ status: 400, message: 'Email is unique!? This email has already been registered' })
        }

    }

    // verify email
    public async VerifyEmail(req: Request, res: Response) {
        const { email, code } = req.body

        const foundUser = await AppDataSource.getRepository(UsersEntity).findOne({
            where: { email }
        })

        if (foundUser) {
            const redisCode = await redis.get(email)
            if (redisCode && redisCode == code) {
                foundUser.verify = true
                await AppDataSource.manager.save(foundUser)

                return res
                    .status(200)
                    .json({
                        status: 200,
                        message: 'Congratulations, you have successfully registered',
                        token: sign({ id: foundUser.id }),
                        user: foundUser
                    });
            } else {
                return res.status(400).json({ status: 400, message: 'Invalid code' });
            }
        } else {
            res.json({ status: 400, message: 'Email not found' })
        }

    }

    // sign email
    public async SignInEmail(req: Request, res: Response) {
        try {
            const { email, password } = req.body

            const foundUser = await AppDataSource.getRepository(UsersEntity).findOne({
                where: { email }
            })

            if (foundUser && await compare(password, foundUser.password) == true) {
                return res.json({
                    status: 200,
                    message: "User login successful",
                    token: sign({ id: foundUser.id }),
                    data: foundUser
                })

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

    // resend email
    public async ResendCodeEmail(req: Request, res: Response) {
        const { email } = req.body

        const foundUser = await AppDataSource.getRepository(UsersEntity).findOne({
            where: { email }
        })
        const oldCode = await redis.del(email);
        if (foundUser && foundUser.verify === false) {
            const code = randomNum();
            redis.set(email, code, 'EX', 120);
            Mail({
                from: {
                    name: "Rise Development",
                    address: "islombektagayev1@gmail.com"
                }, // sender address
                to: email, // list of receivers
                subject: `Rise verification code ✔`, // Subject line
                html: `Welcome ! We appreciate your interest in our service. Your verification code: <br/> <br/> <b>${code}</b>`, // html body
            });
            res.json({
                status: 201,
                message: "Your code sent",
            })
        } else {
            res.json({ status: 400, message: 'Your email is already registered. You can access your account by logging in ' })
        }

    }

    // put and create password
    public async Put(req: Request, res: Response) {
        try {
            const { id } = req.params
            let { email, phone, password, name, surname } = req.body

            password = await hashed(password)

            const user = await AppDataSource.getRepository(UsersEntity).findOneBy({ id: +id })


            user.email = email != undefined ? email : user.email
            user.phone = phone != undefined ? phone : user.phone
            user.password = password != undefined ? password : user.password
            user.name = name != undefined ? name : user.name
            user.surname = surname != undefined ? surname : user.surname

            await AppDataSource.manager.save(user)

            res.json({
                status: 200,
                message: "user data updated",
                data: user
            })
        } catch (error) {
            console.log(error);
        }
    }

    // forgot password
    public async ForgotPassword(req: Request, res: Response) {
        try {
            const { id } = req.params

            const user = await AppDataSource.getRepository(UsersEntity).createQueryBuilder().update(UsersEntity)
                .set({ password: null, verify: false })
                .where({ id })
                .returning("*")
                .execute()

            res.json({
                status: 200,
                message: "user deleted",
                data: user.raw[0]
            })
        } catch (error) {
            console.log(error);
        }
    }

}

export default new UsersController();

