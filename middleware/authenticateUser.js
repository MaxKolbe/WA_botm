import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
 
export const verifyUser = (req, res, next)=>{
  const token = req.cookies.admin
  if(token){
    jwt.verify(token, process.env.JWTSECRET, (err, user)=>{
      if(err){
        res.status(500).redirect('/?error=Error+authenticating+user+Login+again')
      }else{
        // req.user = user
        next()
      }  
    })
  }else{ 
    res.status(500).redirect('/')//no token
  }
} 