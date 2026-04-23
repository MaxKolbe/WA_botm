import employeeModel from '../../models/employeeModel.model.js';
import settingsModel from '../../models/settingsModel.model.js';
import otpUsageModel from '../../models/otpUsageModel.model.js';
import barredNumbersModel from '../../models/barredNumbers.model.js';
import otpModel from '../../models/otpModel.model.js';
import groupModel from '../../models/group.model.js';
import { ObjectId } from 'mongoose';

export const getSettingsStats = async () => {
  const settings = await settingsModel.findOne();

  return {
    status: 200,
    message: 'success',
    data: settings,
  };
};

export const getOneOtp = async (message: string) => {
  const otpElement = await otpModel.findOne({ phrase: message });

  return {
    status: 200,
    message: 'success',
    data: otpElement,
  };
};

export const getOneEmployee = async (sender: string) => {
  const user = await employeeModel
    .findOne({ phone: sender })
    .readConcern('majority');

  return {
    status: 200,
    message: 'success',
    data: user,
  };
};

export const createOtpUsageLog = async (
  userId: string,
  OtpElementName: string,
) => {
  const usage = await otpUsageModel.create({
    user: userId,
    otpName: OtpElementName,
    // loginConfirmed: false
  });

  return {
    status: 200,
    message: 'success',
    data: usage,
  };
};

export const getBarredNumber = async (sender: string) => {
  const nonUser = await barredNumbersModel.findOne({ phoneNumber: sender });

  if (!nonUser) {
    return {
      status: 404,
      message: 'Non User not found',
    };
  }

  return {
    status: 200,
    message: 'success',
    data: nonUser,
  };
};

export const createBarredNumber = async (sender: string) => {
  await barredNumbersModel.create({ phoneNumber: sender });

  return {
    status: 200,
    message: 'success',
  };
};

export const sendBroadcast = async () => {
  return;
};

export const createGroup = async (groupName: string, userId: string) => {
  await groupModel.create({
    name: groupName,
    admins: [userId, "69e9d2bfbed6d860599a6666"], //replace the secon with micheal's userID in prod
  });

  return {
    message: `Group "${groupName}" created`,
  };
};

export const addGroupAdmin = async (groupName: string, userId: string, userIds: string[]) => {

await groupModel.updateOne(
    { name: groupName, admins: { $in: userId },},
    { $addToSet: { admins: { $each: userIds } } },
  );

  return {
    message: ``
  }
};

export const deleteGroup = async () => {
  return;
};

export const addMember = async (
  groupName: string,
  newMembers: string[],
  userId: string,
) => {
  // check if group exists
  const group = await groupModel.findOne({
    name: groupName,
    admins: { $in: userId },
  }); // how would an admin know they aren't an admin in that group

  if (!group) {
    return {
      code: 404,
    };
  }

  //transformation to add whatsapp: to phone numbers
  let employeePhones: string[] = [];
  newMembers.forEach((newMember) => {
    employeePhones.push(`whatsapp:${newMember}`);
  });

  //query employee collection while avoiding n+1
  const employees = await employeeModel.find({
    phone: { $in: employeePhones },
  });
  const employeeIds: ObjectId[] = employees.map((employee) => employee.id);

  // add members to the group
  await groupModel.updateOne(
    { name: groupName },
    { $addToSet: { members: { $each: employeeIds } } },
  );

  return {};
};

export const deleteMember = async () => {
  return;
};

export const viewGroup = async () => {
  return;
};

export const viewAllGroups = async () => {
  return;
};
