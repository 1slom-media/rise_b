import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'
dotenv.config()

class Sms {
    #login: string;
    #password: string;


    constructor(login: string, password: string) {
        this.#login = login;
        this.#password = password;
    }

    async auth(): Promise<void> {
        try {
            const response: AxiosResponse = await axios.post(
                'https://notify.eskiz.uz/api/auth/login',
                {
                    email: this.#login,
                    password: this.#password,
                }
            );
            const data = response.data;
            fs.writeFileSync(
                path.join(process.cwd(), 'token.json'),
                JSON.stringify(data, null, 2)
            );
        } catch (error) {
            console.error(error.message);
        }
    }

    async send(phonenumber: string, message: string): Promise<any> {
        try {
            const tokenData = JSON.parse(
                fs.readFileSync(path.join(process.cwd(), 'token.json'), 'utf-8')
            );

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://notify.eskiz.uz/api/message/sms/send',
                headers: {
                    Authorization: `Bearer ${tokenData.data.token}`,
                },
                data: {
                    mobile_phone: phonenumber,
                    message: message,
                    from: 4546,
                },
            };

            const response: AxiosResponse = await axios(config);
            return response.data;
        } catch (error) {
            await this.auth();
            const tokenData = JSON.parse(
                fs.readFileSync(path.join(process.cwd(), 'token.json'), 'utf-8')
            );

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://notify.eskiz.uz/api/message/sms/send',
                headers: {
                    Authorization: `Bearer ${tokenData.data.token}`,
                },
                data: {
                    mobile_phone: phonenumber,
                    message: message,
                    from: 4546,
                },
            };

            const response: AxiosResponse = await axios(config);
            return response.data;
        }
    }
}

const sms = new Sms(process.env.SMS_LOGIN, process.env.SMS_PASSWORD);
export default sms;
