import { Request, Response } from 'express';
import { signJwt } from '../../utils/signJwt.js';
import { getAllOtps, getAllUsers } from './admin.service.js';
import { ParsedQs } from '../../types/admintypes.js';
import dotenv from 'dotenv';
dotenv.config();

// Authentication Controllers
export const getLoginPageController = async (req: Request, res: Response) => {
  res.render('login', { req });
};

export const postLoginPageController = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    if (password === (process.env.ADMIN as string)) {
      const token = signJwt(password);
      res.cookie('admin', token, { httpOnly: true }); //save the jwt as a cookie
      res.status(200).redirect('/home');
    } else {
      res.status(404).redirect('/?error=Incorrect+password+love');
    }
  } catch (err) {
    console.error('An error occured at postLoginPageController', err);
    res.status(500).redirect('/?error=An+error+occurred+during+login');
  }
};

export const logOutController = async (req: Request, res: Response) => {
  res.clearCookie('admin');
  res.status(200).redirect('/?message=Logged+out+successfully');
};

// Home Controllers
export const getHomeController = async (req: Request, res: Response) => {
  res.render('home');
};

export const viewOtpsController = async (req: Request, res: Response) => {
  try {
    const page: string | ParsedQs | 1 | (string | ParsedQs)[] =
      req.query.page || 1; // Default to page 1 if no query parameter
    const skip = (page - 1) * 10; // Calculate the number of documents to skip

    const response = await getAllOtps(skip, 10); // Seconde param is a Limit

    res.render('viewOtps', {
      req,
      otps: response.data!.otps,
      currentPage: page,
      totalPages: response.data!.totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching OTPs.');
  }
};

export const viewUsersController = async (req: Request, res: Response) => {
  try {
    const page: string | ParsedQs | 1 | (string | ParsedQs)[] =
      req.query.page || 1;
    const skip = (page - 1) * 10; // Calculate the number of documents to skip
    const response = await getAllUsers(skip, 10);
    
    res.render('viewEmployees', {
      req,
      employees: response.data!.employees,
      currentPage: page,
      totalPages: response.data!.totalPages,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching employees.');
  }
};

// export const Controller = async (req: Request, res: Response) => {

// };
// export const Controller = async (req: Request, res: Response) => {

// };
