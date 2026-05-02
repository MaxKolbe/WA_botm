import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret: string = process.env.JWTSECRET as string;

export const signJwt = (id: string, role: boolean) => {
  return jwt.sign({ id, role }, secret, { expiresIn: 60 * 60 * 24 }); //1 day
};
