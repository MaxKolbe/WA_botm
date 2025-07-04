import employeeModel from '../models/employeeModel.js'
import otpModel from '../models/otpModel.js'
import settingsModel from '../models/settingsModel.js'
import { sendAuthCode, sendWhatsAppMessage} from '../utils/botFunctions.js'
import { generateCode } from '../utils/otpGenerator.js'

export const botRequests = async (req, res) => {
  try {
    const settings = await settingsModel.findOne()
    const message = req.body.Body?.trim().toUpperCase()
    const sender = req.body.From.trim()

    const user = await employeeModel.findOne({ phone: sender }).readConcern('majority')
    const otpElement = await otpModel.findOne({ phrase: message })

    if (!user) {
      return res.send(`<Response><Message>No such employee found. Access denied.</Message></Response>`)
    }

    // Check and reset firsttime if expired
    if (user.firsttimeResetAt && user.firsttimeResetAt <= new Date()) {
      user.firsttime = true
      user.firsttimeResetAt = null
      await user.save()
    }

    // Check and reset queried if expired
    if (user.queriedResetAt && user.queriedResetAt <= new Date()) {
      user.queried = false
      user.queriedResetAt = null
      await user.save()
    }

    // Check and reset attempts if expired
    if (user.attemptsResetAt && user.attemptsResetAt <= new Date()) {
      user.attempts = 0
      user.enabled = true
      user.attemptsResetAt = null
      await user.save()
    }

    // Handle first-time message
    if (user.firsttime === true && !otpElement) {
      res.send(`
<Response>
  <Message> 
Hi there 👋

Welcome to NenBot! Here's how it works:

Please enter a *phrase* to receive your one-time password (OTP).

You can request up to 3 OTPs. After that, you'll need to wait for a period of time before trying again.

If you message NenBot and you don't get a reply within a minute (NenBot is NOT disabled or you have NOT reached your usage limits), please resend your message to make sure it goes through.
  </Message>
</Response>`)

      user.firsttime = false
      user.firsttimeResetAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      await user.save()
      return
    }

    // If user recently queried while bot disabled
    if (user.queried === true) {
      console.log("Secret message to let you know bot got disabled previously")
      return // No message sent again to avoid spamming
    }

    // Check bot enabled/disabled status
    if (settings && !settings.botEnabled) {
      user.queried = true
      user.queriedResetAt = new Date(Date.now() + 15 * 60 * 1000) // 15 mins
      await user.save()
      return res.send(`<Response><Message>The bot is currently disabled. Please try again later.</Message></Response>`)
    }

    // If attempts exceed limit
    if (user.attempts > 2) {
      user.enabled = false
      user.attemptsResetAt = new Date(Date.now() + 2 * 60 * 1000) // 2 mins
      await user.save()
      return res.send(`<Response><Message>You have exceeded the maximum attempts. Please wait 2 minutes before trying again.</Message></Response>`)
    }

    // Check if phrase exists
    if (!otpElement) {
      user.attempts += 1
      await user.save()
      return res.send(`<Response><Message>Invalid phrase. Please send a valid phrase to receive an OTP.</Message></Response>`)
    }

    // Valid phrase: Generate and send OTP
    const code = generateCode(otpElement.secret)
    console.log(`[BOT] Sending code to ${user.name}: ${code}`)
    sendAuthCode(user.name, sender, code)

    // Increment attempts and set/reset the cooldown timestamp
    user.attempts += 1
    if (!user.attemptsResetAt) {
      user.attemptsResetAt = new Date(Date.now() + 5 * 60 * 1000) // 5 mins from now
    }
    await user.save()

    return

  } catch (err) {
    console.error(err)
    return res.send(`<Response><Message>An error occurred. Please try again later.</Message></Response>`)
  }
}

/*
Beware of invisible strings [U+202A]
*/