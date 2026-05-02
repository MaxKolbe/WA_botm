import { Request, Response, NextFunction } from 'express';
import {
  deleteGroup,
  sendBroadcast,
  viewGroup,
  deleteMember,
  addMember,
  addGroupAdmin,
  removeGroupAdmin,
  createGroup,
} from '../bot/bot.services.js';

export const sendMessageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const groupName = req.params.name!;
    const userId = req.user!.id;
    const { message } = req.body;
    // console.log(groupName, userId, message);
    const response = await sendBroadcast(groupName, userId, message);

    if (response.code === 404) {
      return res
        .status(401)
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

export const createGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => { 
  const { name } = req.body;
  const userId = req.user!.id;
  const isSuperAdmin = req.user!.role
  try {
    const response = await createGroup(name, userId!, isSuperAdmin!);
    return res.status(201).redirect(`/adminops?message=group+${name}+created`);
  } catch (err) {
    return res.status(500).redirect(`/adminops?error=${err}`);
  }
};

export const addMemberController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let phoneArr: string[] = [];
  const { employee, phone } = req.body;
  const group = req.params.name;
  const userId = req.user!.id;
 
  if(employee){
    phoneArr.push(employee);
  }

  if(phone){
    phoneArr.push(phone);
  }
  // console.log(phoneArr)

  try {
    const response = await addMember(group!, phoneArr, userId);

    if (response.code === 404) {
      return res
        .status(401)
        .redirect(
          `/admin-broadcast/adminops/${group}?error=You+cannot+add+a+member+to+this+group`,
        );
    }

    return res
      .status(200)
      .redirect(
        `/admin-broadcast/adminops/${group}?message=member+added+to+group+${group}`,
      );
  } catch (err) {
    return res
      .status(500)
      .redirect(`/admin-broadcast/adminops/${group}?error=${err}`);
  }
};

export const assignController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let phoneArr: string[] = [];
  const { employee, execute } = req.body;
  const group = req.params.name;
  phoneArr.push(employee);
  const userId = req.user!.id;
  try {
    if (execute === 'revoke') {
      await removeGroupAdmin(group!, phoneArr, userId);
      return res
        .status(200)
        .redirect(
          `/admin-broadcast/adminops/${group}?message=admin+status+revoked`,
        );
    }

    await addGroupAdmin(group!, phoneArr, userId);

    return res
      .status(200)
      .redirect(
        `/admin-broadcast/adminops/${group}?message=admin+added+to+group+${group}`,
      );
  } catch (err) {
    // console.log(err);
    return res
      .status(500)
      .redirect(`/admin-broadcast/adminops/${group}?error=${err}`);
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
        .status(401)
        .redirect(
          `/admin-broadcast?error=You+cannot+view+members+of+this+group`,
        );
    }

    return res.render('broadcastEmployees', {
      req,
      groupMembers: response.data,
      groupName,
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
    // console.log('Phonearr', phoneArr);

    const response = await deleteMember(name!, phoneArr, userId);

    if (response.code === 404) {
      return res
        .status(401)
        .redirect(
          `/admin-broadcast?error=You+cannot+remove+members+of+this+group`,
        );
    }
    return res
      .status(200)
      .redirect(
        `/admin-broadcast/view/${name}?message=Member+removed+from+group+successfully`,
      );
  } catch (err) {
    return res.status(500).redirect(`/admin-broadcast?error=${err}`);
  }
};

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
        .status(401)
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
