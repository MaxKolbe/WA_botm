import employeeModel from '../../models/employeeModel.js';
import settingsModel from '../../models/settingsModel.js';
import otpUsageModel from '../../models/otpUsageModel.js';
import barredNumbersModel from '../../models/barredNumbers.js';
import otpModel from '../../models/otpModel.js';

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
