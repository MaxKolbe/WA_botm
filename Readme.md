# WhatsApp Chatbot for OTP Authentication
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-0F4C81?style=for-the-badge&logoColor=white)
![OTPLib](https://img.shields.io/badge/otplib-OTP-red?style=for-the-badge)

WA_botm is a WhatsApp chatbot for OTP authentication. It provides secure login verification, a user-friendly admin interface as well as usage tracking. It can be used and modified for secure access and customer verification.

## 📄 Content
1. [Quickstart](#quickstart)
2. [Build Stack](#build-stack)
3. [Features](#features)
4. [Twilio Setup](#twilio-setup)
5. [Database Schemas](#database-schemas)
6. [Bot Logic](#bot-logic)
7. [Admin User Interface](#admin-user-interface)
8. [Troubleshooting](#troubleshooting)

## ⚡ Quickstart
- Clone the repository
    >  git clone https://github.com/MaxKolbe/WA_botm.git <br> cd WA_botm
- Install dependencies
    >  npm install 
- Set up environment variables. Create a .env file in the root directory with: 
    > TWILIO_ACCOUNT_SID = your_twilio_account_sid <br>
    TWILIO_AUTH_TOKEN = your_twilio_auth_token <br>
    TWILIO_WHATSAPP_NUMBER = your_twilio_whatsapp_number <br>
    MONGODB_URI = your_mongodb_url
-   Run the development server
    > npm run start

## 🧱 Build Stack
1. Admin Interface (Frontend): Ejs
2. Styling: Vanilla CSS 
3. Language: JavaScript
4. Framework: ExpressJs
5. Database: Mongodb
6. WhatsApp Sender: Twilio
7. Otp Generator: Otplib

## ✨ Features
- WhatsApp OTP Sender: Send a phrase = receive an OTP
- Admin dashboard: manage OTPs and employees, toggle bot status
- OTP usage logs

## 📡 Twilio Setup
Twilio is a customer engagement platform that simplifies communication and makes communication channels like voice, messaging and video accessible to everyone through APIs.

This project uses Twilio's WhatsApp API to enable the chatbot. You’ll learn to set it up in both Sandbox (for development) and Production (live deployment) environments. 

> First , sign up on Twilio [here](https://login.twilio.com/u/signup)

Before diving into the setup steps, I’ve provided direct links below to the most essential Twilio documentation you'll need for setting up the WhatsApp sender and related configurations.

While I do cover these steps in this documentation, the official guides may help clarify any changes or edge cases. It's recommended you review them alongside this guide for the most accurate and up-to-date process.

Helpful Resources:

> [Twilio Docs](https://www.twilio.com/docs) <br>
[Getting Started with WhatsApp](https://www.twilio.com/docs/whatsapp/getting-started)<br>
[Try Whatsapp via Sandbox](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)<br>
[The WhatsApp Business Platform with Twilio](https://www.twilio.com/docs/whatsapp)<br>
[Register on WhatsApp using Self Sign-up](https://www.twilio.com/docs/whatsapp/self-sign-up)<br>

### 🧪 Sandbox [Try Whatsapp via Sandbox](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
This is basically a development space where you can test sending and receiving messages on whatsapp. Twilio provides you with a phone number(WhatsApp Sender) for testing purposes, you first text with the `join-code` provided to enable you use it for testing. 
- You can send a message from Whatsapp (WhatsApp Sender) to your user (YOU in this case) using the following code: 
```javascript
const accountSid = your_account_sid
const authToken = your_auth_token
const client = require('twilio')(accountSid, authToken)

client.messages
    .create({
        body: 'Hey, this is a test message',
        from: 'whatsapp:+whatsapp_sender', // your twilio phone number
        to: 'whatsapp:+your_phone_number'
    })
    .then(message => console.log(message))
    .done();
    // phonenumbers must be in this format: 'whatsapp:yourcountrycode_phonenumber'
```
You will find your AccountSid and AuthToken at the [Twilio console dashboard](https://console.twilio.com/)
> Note that the whatsapp sender will eventually be the phone number you register and will be also be referred to as the `bot` in this documentation
- You can send a message to your bot (whatsapp sender) as well. However to respond to this message (from your project-backend) you will need to set up a [webhook](#webhook) in the sandbox settings. 
> You will set this webhook url in your registered whatsapp sender settings as well
- After setting up the [webhook](#webhook) you can send a message using a [function](#function) or just respond with twilio's messaging script e.g. 
``` javascript
return res.send(`<Response><Message>Hello</Message></Response>`)
```

#### 🎣 webhook
A webhook is like a way for an app (like Twilio) to send a message to your app when something happens. <br>
In this case, a webhook is a URL that Twilio calls whenever an event happens (like receiving a WhatsApp message), so your app can react to it. <br>
You set the webhook URL in your Twilio console, and your app must have that same route ready to receive the info (e.g., a POST route like /bot).

#### ⚙️ function
- You can create a function to respond to messages sent to your bot (same as requests to your webhook):
```javascript
const accountSid = your_account_sid;
const authToken = your_auth_token;
const client = require('twilio')(accountSid, authToken);

export const sendWhatsAppMessage = async (senderPhoneNumber, reply) => {
  const message = await client.messages.create({
    body: `${reply}`, 
    from: 'whatsapp:+whatsapp_sender', // your twilio phone number, 
    to: `${senderPhoneNumber}`
  })

  console.log(message)
}
```
- Then call the function in your webhook route
```javascript
app.post("/bot", (req, res) => {
    const message = req.body.Body
    const senderPhoneNumber = req.body.From
    const reply = "Hi"

    sendWhatsAppMessage(senderPhoneNumber, reply)
})
```

### 🚀 Production [Register on WhatsApp using Self Sign-up](https://www.twilio.com/docs/whatsapp/self-sign-up)
For production you will need to register your own WhatsApp sender to enable you send messages. 
> Here's a great youtube video explaining how to do this [Link](https://youtu.be/9ezp4TD10rE?si=ZZ7Vclv-iFN8w778) 

The steps are still listed below: 

1. **Ugrade your Twilio account** 
- This involves submitting some form of ID and putting in some money (>$20) in your account.
2. **Buy a Phone number**
- On the develop console click on `manage` then `buy a number`
- Choose a phone number to buy and make sure it has messaging capabilities. This is a monthly subscription and it will deduct the related amount from your twilio account balance monthly. 
3.  **Register a WhatsApp Sender**
> Note you'll need a facebook account for this
 - On the develop console click on `messaging` then `whatsapp senders`
 - Click on `Get Started` 
 - Select the phone number to register (the phone number you bought.) Click on `continue with facebook`  and follow the wizard prompts. Make sure to select `Create a Whatapp business account` and `Create a new Whatsapp business Profile`, follow the rest of the wizard prompts to complete this step
 4.  **Create a Messaging Service**
 - On the develop console click on `messaging` then `services` then `create messaging service`. Make sure to choose "Whatsapp Number" when prompted to ass a sender. Follow the wizard prompt to finsih this. 
 - Make sure to click on the phone number check box and click on the 'Add Phone Numbers' button on the`STEP TWO` portion of this 4.
 5.  **Set up the webhook**
 - On the develop console click on `messaging` then `senders` then `whatsapp senders`. Click on the `Edit Sender` for the phone number you've registered. 
 - Edit the Webhook URL for incoming messages and replace it with your own. 
 6. You can now add the WhatsApp Sender to the from property on your sender function. i.e 
 ```javascript
 client.messages.create({
    from: 'whatsapp:+whatsapp_sender'
  })
 ```

## 📄 Database Schemas
- Employee Schema <br>
```
name: String
phone: String
enabled: Boolean (default: true)
attempts: Number (default: 0)
queried: Boolean (default: false)
firsttime: Boolean (default: true)
firsttimeResetAt: Date (default: null)
queriedResetAt: Date (default: null)
attemptsResetAt: Date (default: null)
otpLogs: [ObjectId] (ref: otpUsage)
timestamps: true
```

- OTP Schema <br>
```
name: String
secret: String
phrase: String
issuer: String
timestamps: true
```

- OTP Usage Schema <br>
```
user: ObjectId (ref: employees)
otpName: String
queriedAt: Date (default: Date.now)
loginConfirmed: Boolean (default: false)
timestamps: true
```

- Settings Schema <br>
```
botEnabled: Boolean (default: true)
timestamps: true
```
## Admin User Interface

The Admin User Interface provides a simple way to monitor and manage the bot and user activity. It includes the following features:

- **Dashboard**: Displays an overview of OTP usage logs and user activity.
- **Employee Management**: View all registered employees, their status (enabled/disabled), OTP attempt count, and more.
- **OTP Logs**: View logs of all OTP requests, including user, OTP name, date, and whether login was confirmed.
- **Search**: Search OTP logs by employee, OTP name, or date.
- **Delete Logs**: Remove individual logs or clear all logs.
- **Bot Settings**: Toggle the bot on or off for maintenance or updates.

All actions are accessible through an EJS-rendered interface and protected routes to ensure only authorized users can perform administrative tasks.

## 🔁 Bot Logic
1. **Receive Incoming Message**

   * Extracts the message body and sender phone number from the incoming Twilio request.

2. **Fetch Required Data**

   * Looks up:

     * The current global `settings` (e.g. bot enabled/disabled).
     * The `employee` who sent the message, using their phone number.
     * The `OTP` that matches the provided phrase (if any).

3. **Deny Access for Unknown Users**

   * If no employee matches the sender’s phone, reply:
     `"No such employee found. Access denied."`

4. **Reset Flags if Cooldowns Have Expired**

   * Resets these flags if their cooldown dates have passed:

     * `firsttime`
     * `queried`
     * `attempts` and `enabled`

5. **Handle First-Time Message**

   * If `firsttime` is true and no valid OTP phrase is detected:

     * Sends a welcome message explaining usage instructions.
     * Disables the firsttime flag and sets a 24-hour cooldown.

6. **Skip Response if Already Warned**

   * If user was already warned about the bot being disabled (`queried === true`), do nothing (avoids spam).

7. **Check If Bot Is Globally Disabled**

   * If the bot is off (`botEnabled === false`), warn the user:

     * Save a 15-minute cooldown (`queriedResetAt`) to avoid repeat warnings.
     * Respond: `"The bot is currently disabled. Please try again later."`

8. **Handle Excessive OTP Attempts**

   * If the user has more than 2 failed attempts:

     * Disable the user temporarily.
     * Set a 2-minute cooldown (`attemptsResetAt`).
     * Respond: `"You have exceeded the maximum attempts..."`

9. **Handle Invalid OTP Phrase**

   * If no matching OTP phrase was found:

     * Increment the user’s attempt counter.
     * Respond: `"Invalid phrase. Please send a valid phrase to receive an OTP."`

10. **Handle Valid OTP Request**

    * If phrase is valid:

      * Generate an OTP using `otplib`.
      * Send it using `sendAuthCode()`.
      * Increment the attempt count.
      * If not already on cooldown, set a 5-minute cooldown.

11. **Log OTP Usage**

    * Create a new entry in the `otpUsage` collection.
    * Push the usage ID to the user’s `otpLogs`.

12. **Save Final State**

    * Save the updated user document and end the response.

13. **Catch and Handle Errors**

    * If anything goes wrong, log the error and send a generic failure message.

## 📌 Troubleshooting

### 🟡 Bot Not Responding on WhatsApp

---

**Issue:**  
You send a phrase to the WhatsApp bot, but receive no OTP or only one tick (message not delivered).

**Possible Causes & Fixes:**

- **✅ Twilio WhatsApp Sender Restricted or Disabled by Meta**  
  Meta might restrict your sender number if your [Business Profile](https://business.whatsapp.com/policy) lacks a proper website or violates Meta's Business Policy.

  **Fix:**  
  - Ensure your website clearly describes your services.
  - Add it to your Meta Business Manager profile.
  - Request a review from Meta to reactivate your number.

- **✅ Bot Disabled in Settings**  
  If the bot was disabled through the settings, users will not receive OTPs.

  **Fix:**  
  - Re-enable the bot by toggling the setting in your admin panel or directly updating the database.

- **✅ Rate Limits Hit by User**  
  A user may exceed OTP attempts (more than 3), triggering a temporary block.

  **Fix:**  
  - Wait for the cooldown period (2 minutes for attempts).
  - You can also reset the user's status manually in the database.

---

### 🟡 502 Bad Gateway on Render

---

**Issue:**  
The deployed web service returns a `502 Bad Gateway` error.

**Possible Causes & Fixes:**

- **✅ Server Crashed or Didn't Start Properly**  
  Check your logs on Render for stack traces or port issues.

  **Fix:**
  ```js
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


## 📘Liscense
This project is proprietary software. All rights reserved.
