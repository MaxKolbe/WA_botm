import { Router } from 'express';
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
// import { verifyUser } from '../../middleware/authenticateUser.js';

const adminRouter = Router();

// Authentication Routes
adminRouter.get('/', getLoginPageController);
adminRouter.post('/login', postLoginPageController);
adminRouter.get('/logout', logOutController);

// Admin Home Routes
adminRouter.get('/home', getHomeController);
adminRouter.get('/otps', viewOtpsController);
adminRouter.get('/users', viewUsersController);
adminRouter.post('/searchOtps', searchOtpsController);
adminRouter.post('/searchEmployees', searchEmployeesController);
adminRouter.get('/employeelog', viewEmployeeLogsController);
adminRouter.delete('/deleteOneLog/:id', deleteOneLogController);
adminRouter.delete('/deleteAllLogs', deleteAllLogsController);
adminRouter.get('/searchLogs', searchLogsController);

// Admin Operation Routes
adminRouter.get('/adminops', viewAdminOpsController);
adminRouter.post('/admin/change-phrase', changePhraseController);
adminRouter.post('/admin/add-employee', addEmployeeController);
adminRouter.delete('/admin/remove-employee', removeEmployeeController);
adminRouter.post('/admin/add-otp', addOtpController);
adminRouter.post('/admin/toggle-bot', toggleBotController);

export default adminRouter;
