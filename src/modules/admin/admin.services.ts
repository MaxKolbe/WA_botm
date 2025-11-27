import otpModel from '../../models/otpModel.js';
import employeeModel from '../../models/employeeModel.js';
import settingsModel from '../../models/settingsModel.js';
import otpUsageModel from '../../models/otpUsageModel.js';
import { IQuery } from '../../types/admintypes.js';

// Get otps Function
export const getAllOtps = async (skip: number, limit: number) => {
  const otps = await otpModel.find().sort({ name: 1 }).skip(skip).limit(limit);
  const totalDocuments = await otpModel.countDocuments();
  const totalPages = Math.ceil(totalDocuments / limit);

  if (!otps) {
    return {
      status: 404,
      error: 'otps not found',
    };
  }

  return {
    status: 200,
    message: 'success',
    data: { otps, totalPages },
  };
};

// Get all users Function
export const getAllUsers = async (skip: number, limit: number) => {
  const employees = await employeeModel
    .find()
    .sort({ name: 1 })
    .skip(skip)
    .limit(limit);
  const totalDocuments = await employeeModel.countDocuments();
  const totalPages = Math.ceil(totalDocuments / limit);

  if (!employees) {
    return {
      status: 404,
      error: 'employees not found',
    };
  }

  return {
    status: 200,
    message: 'success',
    data: { employees, totalPages },
  };
};

//Search For Otps Function
export const searchOtps = async (query: string) => {
  const searchResults = await otpModel.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { secret: { $regex: query, $options: 'i' } },
      { phrase: { $regex: query, $options: 'i' } },
    ],
  });

  return {
    status: 200,
    message: 'Otp found',
    data: searchResults,
  };
};

//Search For Employees Function
export const searchEmployees = async (query: string) => {
  const searchResults = await employeeModel.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { phone: { $regex: query, $options: 'i' } },
    ],
  });

  return {
    status: 200,
    message: 'Otp found',
    data: searchResults,
  };
};

// View Employee Logs Function
export const viewEmployeeLogs = async (skip: number, limit: number) => {
  const logs = await otpUsageModel
    .find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user');
  const employees = await employeeModel.find().sort({ name: 1 });
  const otps = await otpModel.find().sort({ name: 1 });

  const totalDocuments = await otpUsageModel.countDocuments();
  const totalPages = Math.ceil(totalDocuments / limit);

  if (!employees || !otps || !logs) {
    return {
      status: 404,
      error: 'Object(employee/otp/log) not found',
    };
  }

  return {
    status: 200,
    message: 'success',
    data: { logs, totalPages, employees, otps },
  };
};

// Delete Individual Log Function
export const deleteOneLog = async (id: string) => {
  const log = await otpUsageModel.findById(id);

  // Remove the log reference from the associated user
  await employeeModel.findByIdAndUpdate(log!.user, {
    $pull: { otpLogs: log!._id },
  });

  // Delete the log itself
  await otpUsageModel.findByIdAndDelete(id);

  return {
    status: 200,
    message: 'Deleted+log+successfully',
  };
};

// Delete All Logs Function
export const deleteAllLogs = async () => {
  //  Delete all logs from the usage collection
  await otpUsageModel.deleteMany({});

  // Remove all references from every user
  await employeeModel.updateMany({}, { $set: { otpLogs: [] } });

  return {
    status: 200,
    message: 'Deleted+all+logs+successfully',
  };
};

// Search logs Function
export const searchLogs = async (query: IQuery) => {
  const logs = await otpUsageModel
    .find(query)
    .populate('user')
    .sort({ queriedAt: -1 });

  // Fetch data again to repopulate selects
  const employees = await employeeModel.find().sort({ name: 1 });
  const otps = await otpModel.find().sort({ name: 1 });

  return {
    status: 200,
    message: 'Found Logs',
    data: { logs, employees, otps },
  };
};

// Retrieve info for Admin Operations Page Function
export const viewAdminOps = async () => {
  const settings = await settingsModel.findOne();
  const mode = settings!.botEnabled;
  const employees = await employeeModel.find().sort({ name: 1 });

  if (!employees) {
    return {
      status: 404,
      error: 'employees not found for admin ops display',
    };
  }

  return {
    status: 200,
    message: 'success',
    data: { employees, mode },
  };
};

// Otp phrase change Function
export const changePhrase = async (otpId: string, newPhrase: string) => {
  await otpModel.findByIdAndUpdate(otpId, { phrase: newPhrase });

  return {
    status: 200,
    message: 'Phrase+Updated',
  };
};

// Add a new employee Function
export const addEmployee = async (name: string, phone: string) => {
  await employeeModel.create({ name, phone: `whatsapp:${phone}` });

  return {
    status: 201,
    message: 'Employee+added+successfully',
  };
};

// Remove Employee Function
export const removeEmployee = async (userId: string) => {
  await otpUsageModel.deleteMany({ user: userId }); // Delete otp logs referencing the user

  await employeeModel.findByIdAndDelete(userId);

  return {
    status: 200,
    message: 'Employee+removed+successfully',
  };
};

// Add OTP Function
export const addOtp = async (
  cleanedName: string,
  cleanedIssuer: string,
  cleanedPhrase: string,
  cleanedSecret: string,
) => {
  await otpModel.create({
    name: cleanedName,
    issuer: cleanedIssuer,
    phrase: cleanedPhrase,
    secret: cleanedSecret,
  });

  return {
    status: 200,
    message: 'Otp+created+successfully',
  };
};

// Toggle Bot Function
export const toggleBot = async (botEnabled: string) => {
  const settings = await settingsModel.findOne();

  if (settings) {
    settings.botEnabled = botEnabled === 'true';
    await settings.save();
  } else {
    await settingsModel.create({ botEnabled: botEnabled === 'true' });
  }

  return {
    status: 200,
    message: 'Bot+status+updated+successfully',
  };
};
