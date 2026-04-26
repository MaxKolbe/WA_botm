import { Router } from 'express';
import { verifyUser } from '../../middleware/authenticate.js';
import {
 deleteOneGroupController,
 sendMessageController,
 viewGroupMembersController,
 removeMemberController
} from './broadcast.controller.js';


import groupModel from '../../models/group.model.js';

const broadcastAdminRouter = Router();

broadcastAdminRouter.get("/", verifyUser,  async (req, res) => {
    const groups = await groupModel.find({}, { "name": 1, "_id": 0 });

    res.render("broadcastHome.ejs", {req, groups})
});

broadcastAdminRouter.delete("/deleteOneGroup/:name", verifyUser, deleteOneGroupController);
broadcastAdminRouter.post("/send/:name", verifyUser, sendMessageController);
broadcastAdminRouter.get("/view/:name", verifyUser, viewGroupMembersController);
broadcastAdminRouter.delete("/deleteOneMember/:name/:phone", verifyUser, removeMemberController);

export default broadcastAdminRouter;
