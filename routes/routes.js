import express from 'express'
import { botRequests, test } from '../controllers/botController.js'
import { getHome, getLoginPage, postLoginPage, logout, viewOtps, viewUsers, viewAdminOps, changePhrase, manageEmployee, addOtp, toggleBot} from '../controllers/adminController.js'
import { verifyUser } from '../middleware/authenticateUser.js'

const router = express.Router() 

// Admin Routes
router.get("/", getLoginPage)
router.post("/login", postLoginPage)
router.get("/home", verifyUser, getHome)
router.get("/logout", verifyUser, logout)
router.get("/otps", verifyUser, viewOtps)
router.get("/users", verifyUser, viewUsers)
router.get("/adminops", verifyUser, viewAdminOps)
router.post("/admin/change-phrase", verifyUser, changePhrase)
router.post("/admin/manage-employee", verifyUser, manageEmployee)
router.post("/admin/add-otp", verifyUser, addOtp)
router.post("/admin/toggle-bot", verifyUser, toggleBot)

// Webhook for Twilio  
router.post("/webhook", botRequests)
router.get("/test", test)


export default router   