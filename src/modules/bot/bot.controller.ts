import { Request, Response } from 'express';
import { generateCode } from '../../utils/otpGenerator.js';
import { sendAuthCode } from '../../utils/botFunctions.js';
import {
  getSettingsStats,
  getOneOtp,
  getOneEmployee,
  createOtpUsageLog,
} from './bot.services.js';

export const botRequests = async (req: Request, res: Response) => {
  try {
    const settings = (await getSettingsStats()).data;
    const message: string = req.body.Body?.trim().toUpperCase();
    const sender: string = req.body.From.trim();

    const otpElement = (await getOneOtp(message)).data;
    const user = (await getOneEmployee(sender)).data;

    if (!user) {
      return res.send(
        `<Response><Message>No such employee found. Access denied.</Message></Response>`,
      );
    }

    // Check and reset firsttime if expired
    if (user.firsttimeResetAt && user.firsttimeResetAt <= new Date()) {
      user.firsttime = true;
      user.firsttimeResetAt = null as any;
      await user.save();
    }

    // Check and reset queried if expired
    if (user.queriedResetAt && user.queriedResetAt <= new Date()) {
      user.queried = false;
      user.queriedResetAt = null as any;
      await user.save();
    }

    // Check and reset attempts if expired
    if (user.attemptsResetAt && user.attemptsResetAt <= new Date()) {
      user.attempts = 0;
      user.enabled = true;
      user.attemptsResetAt = null as any;
      await user.save();
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

Otps are valid for only 30secs. 

If you message NenBot and you don't get a reply within a minute (NenBot is NOT disabled or you have NOT reached your usage limits), please resend your message to make sure it goes through.
  </Message>
</Response>`);

      user.firsttime = false;
      user.firsttimeResetAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      await user.save();
      return;
    }

    // If user recently queried while bot disabled
    if (user.queried === true) {
      console.log('Secret message to let you know bot got disabled previously');
      return; // No message sent again to avoid spamming
    }

    // Check bot enabled/disabled status
    if (settings && !settings.botEnabled) {
      user.queried = true;
      user.queriedResetAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
      await user.save();
      return res.send(
        `<Response><Message>The bot is currently disabled. Please try again later.</Message></Response>`,
      );
    }

    // If attempts exceed limit
    if (user.attempts > 2) {
      user.enabled = false;
      user.attemptsResetAt = new Date(Date.now() + 2 * 60 * 1000); // 2 mins
      await user.save();
      return res.send(
        `<Response><Message>You have exceeded the maximum attempts. Please wait 2 minutes before trying again.</Message></Response>`,
      );
    }

    // Check if phrase exists
    if (!otpElement) {
      user.attempts += 1;
      await user.save();
      return res.send(
        `<Response><Message>Invalid phrase. Please send a valid phrase to receive an OTP.</Message></Response>`,
      );
    }

    // Valid phrase: Generate and send OTP
    const code = generateCode(otpElement.secret);
    //console.log(`[BOT] Sending code to ${user.name}: ${code}`)
    sendAuthCode(user.name, sender, code);

    // Increment attempts and set/reset the cooldown timestamp
    user.attempts += 1;
    if (!user.attemptsResetAt) {
      user.attemptsResetAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins from now
    }

    if (user.attempts === 1) {
      const usage = (await createOtpUsageLog(user.id, otpElement.name)).data;

      // Link usage to user
      user.otpLogs.push(usage.id);
      await user.save();
    }

    await user.save();
    return;
  } catch (err) {
    console.error(err);
    return res.send(
      `<Response><Message>An error occurred. Please try again later.</Message></Response>`,
    );
  }
};
