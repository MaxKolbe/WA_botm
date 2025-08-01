// using authenticator for compatibility with google authenticator
//MICHEAL SHOULD GIVE ME SECRETS

import { totp, authenticator } from 'otplib'

authenticator.options = { step: 45 } // Code expires every 45 seconds

// Returns OTP from a secret
export const generateCode= (secret) => {
    return authenticator.generate(secret)
}

