// middleware to verify an admin and their permissions
import { Request, Response, NextFunction } from "express"
import { getOneEmployee } from "../modules/bot/bot.services.js"

export const verifyAdminandPermissions = () => async (req: Request, res:Response, next: NextFunction) => {
    const sender: string = req.body.From.trim();
    const user = (await getOneEmployee(sender)).data;

    if(!user || !user.isAdmin){
       return res.send(
        `<Response><Message>You are not permitted to use this function</Message></Response>`,
      );  
    }

    next();
}