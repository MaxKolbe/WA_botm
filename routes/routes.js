import express from 'express'
import { botRequests } from '../controllers/botController.js'
import { 
    getHome, 
    getLoginPage, 
    postLoginPage, 
    logout, 
    viewOtps, 
    viewUsers, 
    viewAdminOps, 
    changePhrase, 
    addEmployee, 
    removeEmployee,
    addOtp, 
    toggleBot, 
    searchEmployees, 
    searchOtps, 
    viewEmployeeLogs,
    deleteOneLog,
    deleteAllLogs,
    searchLogs
} from '../controllers/adminController.js'
import { verifyUser } from '../middleware/authenticateUser.js'

const router = express.Router() 

// Admin Routes
router.get("/", getLoginPage)
router.post("/login", postLoginPage)
router.get("/home", verifyUser, getHome)
router.get("/logout", verifyUser, logout)
router.get("/otps", verifyUser, viewOtps)
router.get("/users", verifyUser, viewUsers)
router.post("/searchOtps", verifyUser, searchOtps)
router.post("/searchEmployees", verifyUser, searchEmployees)
router.get("/employeelog", verifyUser, viewEmployeeLogs)
router.delete("/deleteOneLog/:id", verifyUser, deleteOneLog)
router.delete("/deleteAllLogs", verifyUser, deleteAllLogs)
router.post("/searchLogs", verifyUser, searchLogs)

// Admin Operation Routes
router.get("/adminops", verifyUser, viewAdminOps)
router.post("/admin/change-phrase", verifyUser, changePhrase)
router.post("/admin/add-employee", verifyUser, addEmployee)
router.post("/admin/remove-employee", verifyUser, removeEmployee)
router.post("/admin/add-otp", verifyUser, addOtp)
router.post("/admin/toggle-bot", verifyUser, toggleBot)


// Webhook for Twilio  
router.post("/webhook", botRequests)
// router.post("/test", test)


export default router   