import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
 
export const verifyUser = (req: Request, res: Response, next: NextFunction)=>{
  const token = req.cookies.admin
  if(token){
    jwt.verify(token, (process.env.JWTSECRET as string), (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if(err){
        res.status(500).redirect('/?error=Error+authenticating+user+Login+again')
      }else{
        // req.user = decoded
        next()
      }  
    })
  }else{ 
    res.status(500).redirect('/')//no token
  }
} 