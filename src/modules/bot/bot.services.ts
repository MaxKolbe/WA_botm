import employeeModel from '../../models/employeeModel.model.js';
import settingsModel from '../../models/settingsModel.model.js';
import otpUsageModel from '../../models/otpUsageModel.model.js';
import barredNumbersModel from '../../models/barredNumbers.model.js';
import otpModel from '../../models/otpModel.model.js';
import groupModel from '../../models/group.model.js';
import { sendBroadcastMessage } from '../../utils/botFunctions.js';
import { ObjectId } from 'mongoose';
import 'dotenv/config';

const superid1 = (process.env.SUPER_ID_ONE)?.toString();
const superid2 = (process.env.SUPER_ID_TWO)?.toString();

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

/**BROADCAST SERVICES */
export const sendBroadcast = async (
  groupName: string,
  userId: string,
  broadcastMessage: string,
) => {
  const group = await groupModel.findOne({
    name: groupName,
    admins: { $in: userId },
  });

  if (!group) {
    return {
      code: 404,
      message: `group "${groupName}" not found`,
    };
  }

  const employeeIds: ObjectId[] = group.members.map((member) => member);
  const employees = await employeeModel.find({
    _id: { $in: employeeIds },
  });

  const employeePhones: string[] = employees.map((employee) => employee.phone);
  console.log(employeePhones);

  employeePhones.forEach(async (employeePhone) => {
    await sendBroadcastMessage(employeePhone, broadcastMessage);
  });

  return {
    message: `Sent broadcast to group ${groupName}`,
  };
};

export const createGroup = async (groupName: string, userId: string) => {
  await groupModel.create({
    name: groupName,
    admins: [userId, superid1, superid2], 
  });

  return {
    message: `Group "${groupName}" created`,
  };
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
  });

  if (!group) {
    return {
      code: 404,
      message: `group "${groupName}" not found`,
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

export const addGroupAdmin = async (
  groupName: string,
  newAdmins: string[],
  userId: string,
) => {
  //transformation to add whatsapp: to phone numbers
  let employeePhones: string[] = [];
  newAdmins.forEach((newAdmin) => {
    employeePhones.push(`whatsapp:${newAdmin}`);
  });

  //query employee collection while avoiding n+1
  const employees = await employeeModel.find({
    phone: { $in: employeePhones },
  });
  const employeeIds: ObjectId[] = employees.map((employee) => employee.id);

  await groupModel.updateOne(
    { name: groupName, admins: { $in: userId } },
    { $addToSet: { admins: { $each: employeeIds } } },
  );

  await employeeModel.updateMany(
    {
      phone: { $in: employeePhones },
    },
    { $set: { isAdmin: true } },
  );

  return {
    message: `${newAdmins} is now an admin of group "${groupName}"`,
  };
};

export const deleteGroup = async (groupName: string, userId: string) => {
  const group = await groupModel.findOne({
    name: groupName,
    admins: { $in: userId },
  });

  if (!group) {
    return {
      code: 404,
      message: `group "${groupName}" not found`,
    };
  }

  await groupModel.findOneAndDelete({
    name: groupName,
  });

  return {
    message: `Group "${groupName}" deleted successfully`,
  };
};

export const deleteMember = async (
  groupName: string,
  groupMembers: string[],
  userId: string,
) => {
  const group = await groupModel.findOne({
    name: groupName,
    admins: { $in: userId },
  });

  if (!group) {
    return {
      code: 404,
      message: `group "${groupName}" not found`,
    };
  }

  //transformation to add whatsapp: to phone numbers
  let employeePhones: string[] = [];
  groupMembers.forEach((groupMember) => {
    employeePhones.push(`whatsapp:${groupMember}`);
  });

  //query employee collection while avoiding n+1
  const employees = await employeeModel.find({
    phone: { $in: employeePhones },
  });
  const employeeIds: ObjectId[] = employees.map((employee) => employee.id);

  // delete members from the group
  await groupModel.updateOne(
    { name: groupName, admins: { $in: userId } },
    { $pull: { members: { $in: employeeIds } } },
  );

  return {
    message: `${groupMembers} deleted from group "${groupName}"`,
  };
};

export const viewGroup = async (groupName: string, userId: string) => {
  const group = await groupModel.findOne({
    name: groupName,
    admins: { $in: userId },
  });

  if (!group) {
    return {
      code: 404,
      message: `group "${groupName}" not found`,
    };
  }

  const employeeIds: ObjectId[] = group.members.map((member) => member);

  const employees = await employeeModel.find({
    _id: { $in: employeeIds },
  });

  const employeeNames: string[] = employees.map((employee) => employee.name);
  let employeePhones: string[] = [];

  employees.forEach((employee) => {
    employeePhones.push(
      employee.name.concat(' phonenumber: ').concat(employee.phone),
    );
  });
  console.log(employeePhones);
  return {
    data: employeePhones,
  };
};

export const viewAllGroups = async (isSuperAdmin: boolean) => {
  if(isSuperAdmin === false){
    return {
      code: 403,
      message: "You are unauthorized to view all groups"
    }
  }
  const groups = await groupModel.find();
  const groupNames: string[] = groups.map((group) => group.name);
  return {
    data: groupNames
  };
};
