# WhatsApp Chatbot for OTP Authentication
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-0F4C81?style=for-the-badge&logoColor=white)
![OTPLib](https://img.shields.io/badge/otplib-OTP-red?style=for-the-badge)

WA_botm is a WhatsApp chatbot for OTP authentication. It provides secure login verification, a user-friendly admin interface as well as usage tracking. It can be used and modified for secure access and customer verification.

## Content
1. [Quickstart](#quickstart)
2. [Build Stack](#buildstack)
3. [Features](#features)
4. [Twilio Setup (Sandbox → Production)](#twiliosetup)
5. [Database Schemas](#databaseschemas)
6. [Bot Logic](#botlogic)
7. [Admin User Interface](#adminuserinterface)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

## Quickstart
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

## Build Stack
1. Admin Interface (Frontend): Ejs
2. Styling: Vanilla CSS 
3. Language: JavaScript
4. Framework: ExpressJs
5. Database: Mongodb
6. WhatsApp Sender: Twilio
7. Otp Generator: Otplib

## Features
- WhatsApp OTP Sender: phrase → OTP
- Admin dashboard: manage OTPs and employees, toggle bot status
- OTP usage logs

## Liscense
This project is proprietary software. All rights reserved.