import twilio from 'twilio';
import "dotenv/config"

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const registeredSender = process.env.TWILIO_PHONE_NUMBER;
const contentsid = process.env.CONTENT_SID;

export const sendAuthCode = async (
  employee: string,
  phoneNumber: string,
  code: string,
) => {
  const message = await client.messages.create({
    body: `Hey ${employee}, your code is ${code}`,
    from: `${registeredSender}`,
    to: `${phoneNumber}`,
  });

  // console.log(message.body)
  // console.log(message)
};

export const sendWhatsAppMessage = async (
  receiverPhoneNumber: any,
  reply: any,
) => {
  const message = await client.messages.create({
    body: `${reply}`,
    from: `${registeredSender}`,
    to: `${receiverPhoneNumber}`,
  });

  console.log(message)
};

export const sendBroadcastMessage = async (
  receiverPhoneNumber: any,
  broadcast: any,
) => {
  const message = await client.messages.create({
    body: `${broadcast}`,
    from: `${registeredSender}`,
        contentSid: `${contentsid}`,
        contentVariables: `{"1":"${broadcast}"}`,
    to: `${receiverPhoneNumber}`,
  });

  console.log(message)
};
