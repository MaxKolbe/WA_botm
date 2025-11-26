import { Request, Response } from 'express';
import { IQuery } from '../../types/admintypes.js';
import { signJwt } from '../../utils/signJwt.js';
import {
  getAllOtps,
  getAllUsers,
  viewAdminOps,
  changePhrase,
  addEmployee,
  removeEmployee,
  addOtp,
  toggleBot,
  searchOtps,
  searchEmployees,
  viewEmployeeLogs,
  deleteOneLog,
  deleteAllLogs,
  searchLogs,
} from './admin.service.js';
import dotenv from 'dotenv';
dotenv.config();

// Authentication Controllers

// Get Login Page Controller
export const getLoginPageController = async (req: Request, res: Response) => {
  res.render('login', { req });
};
// Login Controller
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
// Logout Controller
export const logOutController = async (req: Request, res: Response) => {
  res.clearCookie('admin');
  res.status(200).redirect('/?message=Logged+out+successfully');
};

// Home Controllers

// Get Home Page Controller
export const getHomeController = async (req: Request, res: Response) => {
  res.render('home');
};
// View OTPs Controller
export const viewOtpsController = async (req: Request, res: Response) => {
  try {
    const page: number = parseInt(req.query.page as any) || 1; // Default to page 1 if no query parameter
    const skip = (page - 1) * 10; // Calculate the number of documents to skip

    const response = await getAllOtps(skip, 10); // Seconde param is a Limit

    if (response.status !== 200) {
      res.status(response.status).json(response.error);
    }

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
// View Employees Controller
export const viewUsersController = async (req: Request, res: Response) => {
  try {
    const page: number = parseInt(req.query.page as any) || 1;
    const skip = (page - 1) * 10; // Calculate the number of documents to skip

    const response = await getAllUsers(skip, 10);

    if (response.status !== 200) {
      res.status(response.status).json(response.error);
    }

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
//Search For Otps Controller
export const searchOtpsController = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    const realQuery = query.trim();

    if (!realQuery) {
      return res.redirect('/otps');
    }

    const response = await searchOtps(realQuery);

    res.render('otpSearchResults', { req, searchResults: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).redirect(`/otps?error=error+during+search`);
  }
};
//Search For Employees Controller
export const searchEmployeesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { query } = req.body;
    const realQuery = query.trim();

    if (!realQuery) {
      return res.redirect('/users');
    }

    const response = await searchEmployees(realQuery);

    res.render('employeeSearchResults', { req, searchResults: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).redirect(`/users?error=error+during+search`);
  }
};
// View Employee Logs Controller
export const viewEmployeeLogsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const page: number = parseInt(req.query.page as any) || 1;
    const skip = (page - 1) * 10; // Calculate the number of documents to skip
    const response = await viewEmployeeLogs(skip, 10);

    res.render('employeeLogs', {
      req,
      logs: response.data!.logs,
      currentPage: page,
      totalPages: response.data!.totalPages,
      employees: response.data!.employees,
      otps: response.data!.otps,
    });
  } catch (err) {
    res.status(500).redirect(`/home`);
  }
};
// Delete Individual Log Function
export const deleteOneLogController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const response = await deleteOneLog(id!);

    res.redirect(`/employeelog?message=${response.message}`);
  } catch (err) {
    res.status(500).redirect(`/employeelog?error=error+deleting+log`);
  }
};
// Delete All Logs Controller
export const deleteAllLogsController = async (req: Request, res: Response) => {
  try {
    const response = await deleteAllLogs();

    res.redirect(`/employeelog?message=${response.message}`);
  } catch (err) {
    res.status(500).redirect(`/employeelog?error=error+deleting+all+logs`);
  }
};
// Search logs Function
export const searchLogsController = async (req: Request, res: Response) => {
  try {
    const { user, otp, startDate, endDate } = req.query;
    const query: IQuery = {};

    // Match by employee ID
    if (user) {
      query.user = user as string;
    }

    // Match by OTP name
    if (otp) {
      query.otpName = otp as string;
    }

    // Date range (on queriedAt)
    if (startDate || endDate) {
      query.queriedAt = {};
      if (startDate) query.queriedAt.$gte = new Date(startDate as string);
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999); // capture entire day
        query.queriedAt.$lte = end;
      }
    }

    const response = await searchLogs(query);

    res.render('employeeLogSearchResults', {
      req,
      logs: response.data.logs,
      employees: response.data.employees,
      otps: response.data.otps,
    });
  } catch (err) {
    console.error(err);
    res.status(500).redirect(`/employeelog?error=error+during+search`);
  }
};

// Admin Operation Controllers

// View Admin Operations Controller
export const viewAdminOpsController = async (req: Request, res: Response) => {
  const response = await viewAdminOps();

  if (response.status !== 200) {
    res.status(response.status).json(response.error);
  }

  res.render('adminops', {
    req,
    mode: response.data!.mode,
    employees: response.data!.employees,
  });
};
// Change Phrase Controller
export const changePhraseController = async (req: Request, res: Response) => {
  try {
    const { otpId, newPhrase } = req.body;
    const cleanNewPhrase = newPhrase
      .replace(/\p{Cf}/gu, '')
      .trim()
      .toUpperCase();
    const response = await changePhrase(otpId, cleanNewPhrase);

    res.redirect(`/adminops?message=${response.message}`);
  } catch (err) {
    console.log(err);
    res.redirect('/adminops?error=Otp+does+not+exist');
  }
};
// Add new empoyee Controller
export const addEmployeeController = async (req: Request, res: Response) => {
  try {
    const { name, phone } = req.body;
    const cleanedPhoneNumber = phone.replace(/\p{Cf}/gu, '');
    const response = await addEmployee(name, cleanedPhoneNumber);

    res.redirect(`/adminops?message=${response.message}`);
  } catch (err) {
    console.log(err);
    res.redirect('/adminops?error=Error+occured+while+adding+employees');
  }
};
// Remove Employee Controller
export const removeEmployeeController = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const response = await removeEmployee(user);

    res.redirect(`/adminops?message=${response.message}`);
  } catch (err) {
    console.log(err);
    res.redirect('/adminops?error=Error+occured+while+removing+employees');
  }
};
// Add OTP Controller
export const addOtpController = async (req: Request, res: Response) => {
  try {
    const { name, issuer, phrase, secret } = req.body;
    const cleanedName = name.replace(/\p{Cf}/gu, '');
    const cleanedIssuer = issuer.replace(/\p{Cf}/gu, '');
    const cleanedPhrase = phrase.replace(/\p{Cf}/gu, '').toUpperCase();
    const cleanedSecret = secret.replace(/\p{Cf}/gu, '');

    const response = await addOtp(
      cleanedName,
      cleanedIssuer,
      cleanedPhrase,
      cleanedSecret,
    );

    res.redirect(`/adminops?message=${response.message}`);
  } catch (err) {
    console.log(err);
    res.redirect('/adminops?error=Error+occured+while+creating+phrase');
  }
};
// Toggle Bot Controller
export const toggleBotController = async (req: Request, res: Response) => {
  try {
    const { botEnabled } = req.body;

    const response = await toggleBot(botEnabled);

    return res.redirect(`/adminops?message=${response.message}`);
  } catch (err) {
    console.log(err);
    res.redirect('/adminops?error=Error+occured+while+toggling+bot');
  }
};
