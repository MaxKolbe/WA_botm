import { Router } from 'express';
import {
  getLoginPageController,
  postLoginPageController,
  logOutController,
  getHomeController,
  viewOtpsController,
  viewUsersController,
} from './admin.controller.js';
import { verifyUser } from '../../middleware/authenticateUser.js';

const adminRouter = Router();

// Admin Routes
adminRouter.get('/', getLoginPageController);
adminRouter.post('/login', postLoginPageController);
adminRouter.get('/home', logOutController);
adminRouter.get('/logout', getHomeController);
adminRouter.get('/otps', viewOtpsController);
adminRouter.get('/users', viewUsersController);
// adminRouter.post('/searchOtps', verifyUser, searchOtps);
// adminRouter.post('/searchEmployees', verifyUser, searchEmployees);
// adminRouter.get('/employeelog', verifyUser, viewEmployeeLogs);
// adminRouter.delete('/deleteOneLog/:id', verifyUser, deleteOneLog);
// adminRouter.delete('/deleteAllLogs', verifyUser, deleteAllLogs);
// adminRouter.get('/searchLogs', verifyUser, searchLogs);

// // Admin Operation Routes
// adminRouter.get('/adminops', verifyUser, viewAdminOps);
// adminRouter.post('/admin/change-phrase', verifyUser, changePhrase);
// adminRouter.post('/admin/add-employee', verifyUser, addEmployee);
// adminRouter.post('/admin/remove-employee', verifyUser, removeEmployee);
// adminRouter.post('/admin/add-otp', verifyUser, addOtp);
// adminRouter.post('/admin/toggle-bot', verifyUser, toggleBot);

export default adminRouter;
