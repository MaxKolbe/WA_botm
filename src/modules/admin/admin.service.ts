import otpModel from '../../models/otpModel.js';
import employeeModel from '../../models/employeeModel.js';
import settingsModel from '../../models/settingsModel.js';
import otpUsageModel from '../../models/otpUsageModel.js';

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

export const getAllUsers = async (skip: number, limit: number) => {
  const employees = await employeeModel.find().sort({ name: 1 }).skip(skip).limit(limit);
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
