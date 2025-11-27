import { authenticator } from 'otplib'; // Using authenticator for compatibility with google authenticator

authenticator.options = { step: 30 }; // Code expires every 30 seconds

// Returns OTP from a secret
export const generateCode = (secret: string) => {
  return authenticator.generate(secret);
};
