import { Router } from 'express';
import { verifyUser } from '../../middleware/authenticate.js';
import {
  deleteOneGroupController,
  sendMessageController,
  viewGroupMembersController,
  removeMemberController,
  addMemberController,
  assignController,
  createGroupController
} from './broadcast.controller.js';

import groupModel from '../../models/group.model.js';
import employeeModel from '../../models/employeeModel.model.js';

const broadcastAdminRouter = Router();

broadcastAdminRouter.get('/', verifyUser, async (req, res) => {
  const groups = await groupModel.find({}, { name: 1, _id: 0 });

  res.render('broadcastHome.ejs', { req, groups });
});
broadcastAdminRouter.get('/adminops/:name', verifyUser, async (req, res) => {
  const groupName = req.params.name!;
  const group = await groupModel.find({name: groupName}, { name: 1, _id: 0 });
  const employees = await employeeModel.find({}, {name: 1, phone: 1, _id: 0})
  res.render('broadcastAdminops.ejs', { req, group: group[0], employees });
});
broadcastAdminRouter.get('/view/:name', verifyUser, viewGroupMembersController);
broadcastAdminRouter.post('/send/:name', verifyUser, sendMessageController);
broadcastAdminRouter.post('/addMember/:name', verifyUser, addMemberController);
broadcastAdminRouter.post('/assign/:name', verifyUser, assignController);
broadcastAdminRouter.post('/create', verifyUser, createGroupController);
broadcastAdminRouter.delete(
  '/deleteOneGroup/:name',
  verifyUser,
  deleteOneGroupController,
);
broadcastAdminRouter.delete(
  '/deleteOneMember/:name/:phone',
  verifyUser,
  removeMemberController,
);

export default broadcastAdminRouter;
