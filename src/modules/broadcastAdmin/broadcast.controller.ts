import groupModel from '../../models/group.model.js';
import { Request, Response, NextFunction } from 'express';
import { deleteGroup, sendBroadcast, viewGroup, deleteMember } from '../bot/bot.services.js';

export const deleteOneGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const groupName = req.params.name!;
    const userId = req.user!.id;
    const response = await deleteGroup(groupName, userId);

    if (response.code === 404) {
      return res
        .status(500)
        .redirect(
          `/admin-broadcast?error=You+do+not+have+permission+to+delete+this+group`,
        );
    }

    return res
      .status(200)
      .redirect(`/admin-broadcast?message=group+deleted+successfully`);
  } catch (err) {
    return res.status(500).redirect(`/admin-broadcast?error=${err}`);
  }
};

export const sendMessageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const groupName = req.params.name!;
    const userId = req.user!.id;
    const { message } = req.body;
    console.log(groupName, userId, message);
    const response = await sendBroadcast(groupName, userId, message);

    if (response.code === 404) {
      return res
        .status(500)
        .redirect(
          `/admin-broadcast?error=You+cannot+send+a+broadcast+to+this+group`,
        );
    }

    return res
      .status(200)
      .redirect(
        `/admin-broadcast?message=broadcast+sent+successfully+to+group+${groupName}`,
      );
  } catch (err) {
    return res.status(500).redirect(`/admin-broadcast?error=${err}`);
  }
};

export const viewGroupMembersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const groupName = req.params.name!;
    const userId = req.user!.id;

    const response = await viewGroup(groupName, userId);

    if (response.code === 404) {
      return res
        .status(500)
        .redirect(
          `/admin-broadcast?error=You+cannot+view+members+of+this+group`,
        );
    }

    return res.render('broadcastEmplyees', {
      req,
      groupMembers: response.data,
      groupName
    });
  } catch (err) {
    return res.status(500).redirect(`/admin-broadcast?error=${err}`);
  }
};

export const removeMemberController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let phoneArr: string[] = [];

  try {
    const { name, phone } = req.params;
    phoneArr.push(phone!);
    const userId = req.user!.id;
    console.log("Phonearr", phoneArr)

    const response = await deleteMember(name!, phoneArr, userId);

    if (response.code === 404) {
      return res
        .status(500)
        .redirect(
          `/admin-broadcast?error=You+cannot+remove+members+of+this+group`,
        );
    }
      return res
        .status(200)
        .redirect(
          `/admin-broadcast?message=Member+removed+from+group+successfully`,
        );

  } catch (err) {
    return res.status(500).redirect(`/admin-broadcast?error=${err}`);
  }
};
