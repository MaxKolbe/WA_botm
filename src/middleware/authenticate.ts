import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: { id: string, role?: boolean};
    }
  }
}

// make sure to redirect properly based on superadmin and admin
export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.admin;
  if (token) {
    jwt.verify(
      token,
      process.env.JWTSECRET as string,
      (
        err: jwt.VerifyErrors | null,
        decoded: any
      ) => {
        if (err) {
          res
            .status(500)
            .redirect('/?error=Error+authenticating+user+Login+again');
        } else {
          req.user = {id: decoded.id, role: decoded.role }
          next();
        }
      },
    );
  } else {
    res.status(500).redirect('/'); //no token
  }
};
