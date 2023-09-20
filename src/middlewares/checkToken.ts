import { Request, Response,NextFunction } from 'express';
import { verify } from '../utils/jwt'

export default (req: Request, res: Response,next:NextFunction) => {
    try {
        if (req.method !== "GET") {
            const token = req.headers.token;
            if (!token) throw new Error("token required");
            verify(token);
        }
        return next()
    } catch (error) {
        res.status(401).json({
            status: 401,
            message: error.message
        })
    }
}