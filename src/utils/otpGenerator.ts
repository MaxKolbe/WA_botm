// using authenticator for compatibility with google authenticator
//MICHEAL SHOULD GIVE ME SECRETS

import { totp, authenticator } from 'otplib'

authenticator.options = { step: 30 } // Code expires every 30 seconds

// Returns OTP from a secret
export const generateCode= (secret) => {
    return authenticator.generate(secret)
}


