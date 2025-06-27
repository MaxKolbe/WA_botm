import employeeModel from '../models/employeeModel.js'
import otpModel from '../models/otpModel.js'
import { sendAuthCode, sendWhatsAppMessage} from '../utils/botFunctions.js'
import { generateCode } from '../utils/otpGenerator.js'

export const botRequests = async (req, res) => {
  try {
    const message = req.body.Body?.trim().toUpperCase()
    const sender = req.body.From

    // Check if user exists
    const user = await employeeModel.findOne({ phone: sender })

    if (!user) {
      return res.send(`<Response><Message>No such employee found. Access denied.</Message></Response>`)
    }

    // Check if user is enabled or blocked due to attempts
    if (!user.enabled) {
      return res.send(`<Response><Message>You have exceeded the maximum attempts. Please wait 2 minutes before trying again.</Message></Response>`)
    }

    // Check if phrase exists
    const otpElement = await otpModel.findOne({ phrase: message })

    if (!otpElement) {
      // Increment attempts on invalid phrase
      user.attempts += 1
      return res.send(`<Response><Message>Invalid phrase.</Message></Response>`)
    }

    // If attempts now exceed 2, disable and set reset timer
    if (user.attempts > 2) {
        user.enabled = false
        await user.save()

        setTimeout(async () => {
            user.attempts = 0
            user.enabled = true
            await user.save()
            console.log(`[BOT] Reset attempts for ${user.name}`)
        }, 2 * 60 * 1000) // 2 mins

        return res.send(`<Response><Message>You have exceeded the maximum attempts. Try again in 2 minutes.</Message></Response>`);
    }

    // Valid phrase: Generate code
    const code = generateCode(otpElement.secret);
    console.log(`[BOT] Sending code to ${user.name}: ${code}`);
    sendAuthCode(user.name, sender, code);

    // Increment attempts
    user.attempts += 1
    await user.save()

    // 7. Start a reset timer so attempts reset even if user doesn't try again
    setTimeout(async () => { 
      user.attempts = 0
      await user.save()
      console.log(`[BOT] Auto-reset attempts for ${user.name}`)
    }, 5 * 60 * 1000) // 5 mins

    return

  } catch (err) {
    console.error(err)
    return res.send(`<Response><Message>An error occurred. Please try again later.</Message></Response>`)
  }
}
