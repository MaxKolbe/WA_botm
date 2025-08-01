import twilio from 'twilio'
import dotenv from 'dotenv'
dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)
const registeredSender = process.env.TWILIO_PHONE_NUMBER

export const sendAuthCode = async (employee, phoneNumber, code)=> {
  const message = await client.messages.create({
    body: `Hey ${employee}, your code is ${code}`,
    from: `${registeredSender}`, 
    to: `${phoneNumber}`, 
  })


  // console.log(message.body)
  // console.log(message) 
}

export const sendWhatsAppMessage = async (senderPhoneNumber, reply) => {
  const message = await client.messages.create({
    body: `${reply}`, 
    from: `${registeredSender}`, 
    to: `${senderPhoneNumber}`
  })

  // console.log(message)
}
