import { randomUUID } from 'crypto';
import logger from '../../configs/logger.config.js';
import { generateCode } from '../../utils/otpGenerator.js';
import { sendAuthCode } from '../../utils/botFunctions.js';
import { Request, Response } from 'express';
import {
  getSettingsStats,
  getOneOtp,
  getOneEmployee,
  createOtpUsageLog,
  getBarredNumber,
  createBarredNumber,
  createGroup,
  addMember,
  addGroupAdmin,
  deleteGroup,
  deleteMember,
  viewAllGroups,
  viewGroup,
  sendBroadcast,
} from './bot.services.js';

export const botRequests = async (req: Request, res: Response) => {
  const childLogger = logger.child({ logId: Date.now() + randomUUID() });

  try {
    const settings = (await getSettingsStats()).data;
    const message: string = req.body.Body?.trim().toUpperCase();
    const sender: string = req.body.From.trim();

    const otpElement = (await getOneOtp(message)).data;
    const user = (await getOneEmployee(sender)).data;

    const nonUser = await getBarredNumber(sender);

    if (!user) {
      if (nonUser.status === 200) {
        if (sender === nonUser.data!.phoneNumber) {
          // console.log('This branch was fired: second time');
          childLogger.info('This branch was fired the SECOND time', {
            culprit: sender,
          });
          return;
        }
      }

      await createBarredNumber(sender);
      // console.log('This branch was fired: first time');
      childLogger.info('This branch was fired the FIRST time', {
        culprit: sender,
      });
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
      // console.log('Secret message to let you know bot got disabled previously');
      childLogger.info(
        'Secret message to let you know bot got disabled previously',
      );
      return; // No message sent again to avoid spamming
    }

    // Check bot enabled/disabled status
    if (settings && !settings.botEnabled) {
      user.queried = true;
      user.queriedResetAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
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
    // console.error(err);
    logger.error(err);
    return res.send(
      `<Response><Message>An error occurred. Please try again later.</Message></Response>`,
    );
  }
};

export const broadcastController = async (req: Request, res: Response) => {
  const broadcastActions = {
    SENDBROADCAST: 'send',
    CREATEGROUP: 'create group',
    DELETEGROUP: 'delete group',
    ADDMEMBER: 'add member',
    DELETEMEMBER: 'delete member',
    ADDGROUPADMIN: 'add admin',
    VIEWGROUPMEMBERS: 'view group',
    VIEWALLGROUPS: 'view all groups',
    HELP: 'help',
  } as const;

  const sender: string = req.body.From.trim();
  const user = (await getOneEmployee(sender)).data;

  const broadcastAction = (req.body.Body as string)
    .toLowerCase()
    .split('/')[1]!
    .trim();

  if (broadcastAction.startsWith(broadcastActions.SENDBROADCAST)) {
    const message = (req.body.Body as string)
      .toLowerCase()
      .split(`${broadcastActions.SENDBROADCAST}`)[1];
    const groupName = message?.split(' ')[1];
    const broadcastMessage = message?.split(groupName!.toString())[1];
    console.log(
      broadcastActions.SENDBROADCAST,
      ':',
      groupName,
      ':',
      broadcastMessage,
    );

    try {
      const response = await sendBroadcast(
        groupName!,
        user?.id,
        broadcastMessage!,
      );

      if (response.code === 404) {
        return res.send(
          `<Response><Message> ${response.message}</Message></Response>`,
        );
      }
      return res.send(
        `<Response><Message>${response.message}</Message></Response>`,
      );
    } catch (err) {
      return res.send(
        `<Response><Message>Could not send broadcast to group ${groupName}</Message></Response>`,
      );
    }
  } else if (broadcastAction.startsWith(broadcastActions.CREATEGROUP)) {
    const groupName = (req.body.Body as string)
      .toLowerCase()
      .split(`${broadcastActions.CREATEGROUP}`)[1]
      ?.trim();
    console.log(broadcastActions.CREATEGROUP, ':', groupName);
    try {
      const response = await createGroup(groupName!, user?.id);
      return res.send(
        `<Response><Message>${response.message}</Message></Response>`,
      );
    } catch (err) {
      return res.send(
        `<Response><Message>Group "${groupName}" could not be created</Message></Response>`,
      );
    }
  } else if (broadcastAction.startsWith(broadcastActions.DELETEGROUP)) {
    const groupName = (req.body.Body as string)
      .toLowerCase()
      .split(`${broadcastActions.DELETEGROUP}`)[1]
      ?.trim();
    console.log(broadcastActions.DELETEGROUP, ':', groupName);

    try {
      const response = await deleteGroup(groupName!, user?.id);
      if (response.code === 404) {
        return res.send(
          `<Response><Message>${response.message}</Message></Response>`,
        );
      }
      return res.send(
        `<Response><Message>${response.message}</Message></Response>`,
      );
    } catch (err) {
      return res.send(
        `<Response><Message>Could not delete group ${groupName}</Message></Response>`,
      );
    }
  } else if (broadcastAction.startsWith(broadcastActions.ADDMEMBER)) {
    const message = (req.body.Body as string)
      .toLowerCase()
      .split(`${broadcastActions.ADDMEMBER}`)[1];
    const groupName = message?.split(' ')[1];
    const newMembers = message?.split(' ')?.slice(2);
    console.log(broadcastActions.ADDMEMBER, ':', message);
    console.log(groupName, ':', newMembers);
    try {
      const response = await addMember(groupName!, newMembers!, user?.id);
      if (response.code === 404) {
        return res.send(
          `<Response><Message>${response.message}</Message></Response>`,
        );
      }
      return res.send(
        `<Response><Message>${newMembers} got added to group "${groupName}"</Message></Response>`,
      );
    } catch (err) {
      return res.send(
        `<Response><Message>"${newMembers}" could not be added</Message></Response>`,
      );
    }
  } else if (broadcastAction.startsWith(broadcastActions.DELETEMEMBER)) {
    const message = (req.body.Body as string)
      .toLowerCase()
      .split(`${broadcastActions.DELETEMEMBER}`)[1];
    const groupName = message?.split(' ')[1];
    const groupMembers = message?.split(' ')?.slice(2);
    console.log(broadcastActions.DELETEMEMBER, ':', message);
    console.log(groupName, ':', groupMembers);
    try {
      const response = await deleteMember(groupName!, groupMembers!, user?.id);
      return res.send(
        `<Response><Message>${response.message}</Message></Response>`,
      );
    } catch (err) {
      return res.send(
        `<Response><Message>${groupMembers} could not be deleted</Message></Response>`,
      );
    }
  } else if (broadcastAction.startsWith(broadcastActions.VIEWGROUPMEMBERS)) {
    const message = (req.body.Body as string)
      .toLowerCase()
      .split(`${broadcastActions.VIEWGROUPMEMBERS}`)[1];
    const groupName = message?.split(' ')[1]?.trim();
    console.log(broadcastActions.VIEWGROUPMEMBERS, ':', message);

    try {
      const response = await viewGroup(groupName!, user?.id);
      if (response.code === 404) {
        return res.send(
          `<Response><Message>${response.message}</Message></Response>`,
        );
      }
      return res.send(
        `<Response><Message>Members of group "${groupName}" include: ${response.data}</Message></Response>`,
      );
    } catch (err) {
      return res.send(
        `<Response><Message>Could not pull up members of group "${groupName}"</Message></Response>`,
      );
    }
  } else if (broadcastAction.startsWith(broadcastActions.VIEWALLGROUPS)) {
    try {
      const response = await viewAllGroups(user!.isSuperAdmin);
      if(response.code === 403){
        return res.send(
        `<Response><Message> ${response.message}</Message></Response>`,
      );
      }
      return res.send(
        `<Response><Message>Active groups: ${response.data}</Message></Response>`,
      );
    } catch (err) {
      return res.send(
        `<Response><Message>Could not view all groups</Message></Response>`,
      );
    }
  } else if (broadcastAction.startsWith(broadcastActions.ADDGROUPADMIN)) {
    const message = (req.body.Body as string)
      .toLowerCase()
      .split(`${broadcastActions.ADDGROUPADMIN}`)[1];
    const groupName = message?.split(' ')[1];
    const newAdmins = message?.split(' ')?.slice(2);
    console.log(broadcastActions.ADDGROUPADMIN, ':', message);

    try {
      const response = await addGroupAdmin(groupName!, newAdmins!, user?.id);
      return res.send(
        `<Response><Message>${response.message}</Message></Response>`,
      );
    } catch (err) {
      return res.send(
        `<Response><Message>"${newAdmins}" could not be made an admin</Message></Response>`,
      );
    }
  } else if (
    broadcastAction.startsWith(broadcastActions.HELP) ||
    broadcastAction === 'h'
  ) {
    res.send(`
<Response>
  <Message> 
Here are the list of available commands:

/SEND groupname message --> sends a broadcast (message) to a group (groupname) 

/CREATE GROUP groupname --> creates a broadcast group (groupname)

/DELETE GROUP groupname --> deletes a broadcast group (groupname)

/ADD MEMBER groupname member/s --> adds one or more members to a broadcast group (groupname). member/s must be a valid phonenumber in countrycode format i.e. +2348066698219. To add more than one member write down another valid phonenumber in countrycode format e.g. /ADD MEMBER examplegroup +2348066698219 +2349068601193

/DELETE MEMBER groupname member/s --> deletes one or more members from a broadcast group (groupname). member/s must be a valid phonenumber in countrycode format i.e. +2348066698219. To delete more than one member write down another valid phonenumber in countrycode format e.g. /DELETE MEMBER examplegroup +2348066698219 +2349068601193

/ADD ADMIN groupname adminphone/s --> makes one or more people an admin to a broadcast group (groupname). adminphone/s must be a valid phonenumber in countrycode format i.e. +2348066698219. To add more than one admin write down another valid phonenumber in countrycode format e.g. /ADD ADMIN examplegroup +2348066698219 +2349068601193

/VIEW GROUP groupname --> lists all members of a broadcast group (groupname)

/VIEW ALL GROUPS --> list all broadcast groups

/HELP --> lists all commanda
  </Message>
</Response>`);
  } else {
    return res.send(
      `<Response><Message>Command does not exist</Message></Response>`,
    );
  }
};
