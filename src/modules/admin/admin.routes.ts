import { Router } from 'express';
import { verifyUser } from '../../middleware/authenticateUser.js';
import {
  getLoginPageController,
  postLoginPageController,
  logOutController,
  getHomeController,
  viewOtpsController,
  viewUsersController,
  searchOtpsController,
  searchEmployeesController,
  viewEmployeeLogsController,
  deleteOneLogController,
  deleteAllLogsController,
  searchLogsController,
  viewAdminOpsController,
  changePhraseController,
  addEmployeeController,
  removeEmployeeController,
  addOtpController,
  toggleBotController,
} from './admin.controller.js';

const adminRouter = Router();

// Authentication Routes
adminRouter.get('/', getLoginPageController);
adminRouter.post('/login', postLoginPageController);
adminRouter.get('/logout', verifyUser, logOutController);

// Admin Home Routes
adminRouter.get('/home', verifyUser, getHomeController);
adminRouter.get('/otps', verifyUser, viewOtpsController);
adminRouter.get('/users', verifyUser, viewUsersController);
adminRouter.post('/searchOtps', verifyUser, searchOtpsController);
adminRouter.post('/searchEmployees', verifyUser, searchEmployeesController);
adminRouter.get('/employeelog', verifyUser, viewEmployeeLogsController);
adminRouter.delete('/deleteOneLog/:id', verifyUser, deleteOneLogController);
adminRouter.delete('/deleteAllLogs', verifyUser, deleteAllLogsController);
adminRouter.get('/searchLogs', verifyUser, searchLogsController);

// Admin Operation Routes
adminRouter.get('/adminops', verifyUser, viewAdminOpsController);
adminRouter.post('/admin/change-phrase', verifyUser, changePhraseController);
adminRouter.post('/admin/add-employee', verifyUser, addEmployeeController);
adminRouter.delete('/admin/remove-employee', verifyUser, removeEmployeeController);
adminRouter.post('/admin/add-otp', verifyUser, addOtpController);
adminRouter.post('/admin/toggle-bot', verifyUser, toggleBotController);

export default adminRouter;
