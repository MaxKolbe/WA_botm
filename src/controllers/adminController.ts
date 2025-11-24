//ADD RESTURN RES.
import otpModel from '../models/otpModel.js'
import employeeModel from '../models/employeeModel.js'
import settingsModel from '../models/settingsModel.js'
import otpUsageModel from '../models/otpUsageModel.js'
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

// Function to sign JWT
const signJwt = (id) => {
    return jwt.sign({id}, process.env.JWTSECRET, {expiresIn: 60*60*24}) //1 day
}

// Get Login Page
export const getLoginPage = (req: Request, res: Response) => {
    res.render("login", {req})
}

// Handle Login
export const postLoginPage = (req: Request, res: Response) => {
    const { password } = req.body
    try{ 
        if(password === process.env.ADMIN){
                const token = signJwt(password)
                res.cookie("admin", token, {httpOnly: true})//save the jwt as a cookie 
                res.status(200).redirect('/home')
            }else{
                res.status(404).redirect('/?error=Incorrect+password+love')   
            }  
    }catch(err){
        // console.error(err)
        res.status(500).redirect('/?error=An+error+occurred+during+login')
    }  
}

// Logout
export const logout = (req: Request, res: Response) => {
    res.clearCookie("admin")
    res.status(200).redirect('/?message=Logged+out+successfully')
}

// Get Home Page
export const getHome = (req: Request, res: Response) => {
    res.render("home")
}

// View OTPs
export const viewOtps = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page) || 1 // Default to page 1 if no query parameter
    const limit = 10 // Limit the number of documents per page
    const skip = (page - 1) * limit // Calculate the number of documents to skip

    try {
        const otps = await otpModel.find().sort({ name: 1 }).skip(skip).limit(limit)
        // Get total number of documents for pagination controls
        const totalDocuments = await otpModel.countDocuments()

        res.render("viewOtps", { req,
            otps, 
            currentPage: page,
            totalPages: Math.ceil(totalDocuments / limit)
        })
    } catch (err) {
        console.error(err) 
        res.status(500).send("Error fetching OTPs.")
    }
}

// View Users
export const viewUsers = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page) || 1 // Default to page 1 if no query parameter
    const limit = 10 // Limit the number of documents per page
    const skip = (page - 1) * limit // Calculate the number of documents to skip

    try {
        const employees = await employeeModel.find().sort({ name: 1 }).skip(skip).limit(limit)
        // Get total number of documents for pagination controls
        const totalDocuments = await employeeModel.countDocuments()

        res.render("viewEmployees", { req, 
            employees, 
            currentPage: page,
            totalPages: Math.ceil(totalDocuments / limit)
        })
    } catch (err) {
        console.error(err) 
        res.status(500).send("Error fetching employees.")
    }
}

// View Admin Operations
export const viewAdminOps = async (req: Request, res: Response) => {
    const settings = await settingsModel.findOne()
    const employees = await employeeModel.find().sort({ name: 1 })
    const mode = settings.botEnabled
    res.render("adminops", {req, mode, employees})
}

// Change Phrase
export const changePhrase = async (req: Request, res: Response) => {
    const { otpId, newPhrase } = req.body
    const upNewPhrase = newPhrase.replace(/\p{Cf}/ug, '').trim().toUpperCase()
    try{
        await otpModel.findByIdAndUpdate(otpId, { phrase: upNewPhrase })
        res.redirect("/adminops?message=Phrase+Updated")
    }catch(err){
        // console.log(err)
        res.redirect("/adminops?error=Otp+does+not+exist")
    }
}

// Add Employee
export const addEmployee = async (req: Request, res: Response) => {
    const { name, phone } = req.body;
    try{
        const cleanedPhoneNumber = phone.replace(/\p{Cf}/ug, '')

        await employeeModel.create({ name, phone: `whatsapp:${cleanedPhoneNumber}` })
        res.redirect("/adminops?message=Employee+added+successfully")
    }catch(err){
        // console.log(err)
        res.redirect("/adminops?error=Error+occured+while+adding+employees")
    }
}

// Remove Employee
export const removeEmployee = async (req: Request, res: Response) => {
    const { user } = req.body
    try{
       await employeeModel.findByIdAndDelete(user)

       res.redirect("/adminops?message=Employee+deleted+successfully")
    }catch(err){
        // console.log(err)
        res.redirect("/adminops?error=Error+occured+while+removing+employees")
    }
}

// Add OTP
export const addOtp = async (req: Request, res: Response) => {
    try{
        const { name, issuer, phrase, secret } = req.body
        const cleanedName = name.replace(/\p{Cf}/ug, '') 
        const cleanedIssuer = issuer.replace(/\p{Cf}/ug, '') 
        const cleanedPhrase = phrase.replace(/\p{Cf}/ug, '').toUpperCase()
        const cleanedSecret = secret.replace(/\p{Cf}/ug, '')

        await otpModel.create({ name: cleanedName, issuer: cleanedIssuer, phrase: cleanedPhrase, secret: cleanedSecret })
        res.redirect("/adminops?message=Otp+created+successfully")
    }catch(err){
        // console.log(err)
        res.redirect("/adminops?error=Error+occured+while+creating+phrase")
    }
}

// Toggle Bot
export const toggleBot = async (req: Request, res: Response) => {
    try{
        const { botEnabled } = req.body

        const settings = await settingsModel.findOne()
        if (settings) {
            settings.botEnabled = botEnabled === 'true'
            await settings.save()
        } else {
            await settingsModel.create({ botEnabled: botEnabled === 'true' })
        }

    return res.redirect('/adminops?message=Bot+status+updated+successfully');
    }catch(err){
        res.redirect("/adminops?error=Error+occured+while+toggling+bot")
    }
}

//Search For Otps
export const searchOtps = async (req: Request, res: Response) => {
    try { 
        const { query } = req.body
        const realQuery = query.trim() 

       
        //Check if query is empty
        if (!realQuery) {
            return res.redirect('/otps')
        }
    
        //Search across fields using $or and $regex for partial matches
        const searchResults = await otpModel.find({
            $or: [ 
                { name: { $regex: realQuery, $options: 'i' } },
                { secret: { $regex: realQuery, $options: 'i' } },
                { phrase: { $regex: realQuery, $options: 'i' } }
            ]
        }) 

        res.render("otpSearchResults", {req, searchResults})
    } catch (err) {
        console.error(err)
        res.status(500).redirect(`/otps?error=error+during+search`)
    }
}

//Search For Employees
export const searchEmployees = async (req: Request, res: Response) => {
    try { 
        const { query } = req.body 
        const realQuery = query.trim() 
       
        //Check if query is empty
        if (!realQuery) {
            return res.redirect('/users')
        }
    
        //Search across fields using $or and $regex for partial matches
        const searchResults = await employeeModel.find({
            $or: [ 
                { name: { $regex: realQuery, $options: 'i' } },
                { phone: { $regex: realQuery, $options: 'i' } }
            ]
        })    
 
        res.render("employeeSearchResults", {req, searchResults})
    } catch (err) {
        console.error(err)
        res.status(500).redirect(`/users?error=error+during+search`)
    }
}

// View Employee Logs
export const viewEmployeeLogs = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page) || 1 // Default to page 1 if no query parameter
    const limit = 10 // Limit the number of documents per page
    const skip = (page - 1) * limit // Calculate the number of documents to skip
     
    try{
        const logs = await otpUsageModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate("user")
        // Get total number of documents for pagination controls
        const totalDocuments = await otpUsageModel.countDocuments()
        const employees = await employeeModel.find().sort({ name: 1 })
        const otps = await otpModel.find().sort({ name: 1 })
         
        res.render("employeeLogs", {req,   
            logs,    
            currentPage: page,
            totalPages: Math.ceil(totalDocuments / limit),
            employees,
            otps
        })
    }catch(err){
        res.status(500).redirect(`/home`)
    } 
}

// Delete Individual
export const deleteOneLog = async (req: Request, res: Response) => {
    try{
        const { id } = req.params

        const log = await otpUsageModel.findById(id)

        // Remove the log reference from the associated user
        await employeeModel.findByIdAndUpdate(log.user, {
            $pull: { otpLogs: log._id }
        })

        // Delete the log itself
        await otpUsageModel.findByIdAndDelete(id)

        res.redirect('/employeelog?message=Deleted+log+successfully')
    }catch(err){
        res.status(500).redirect(`/employeelog?error=error+deleting+log`)
    }
}

// Delete All Logs
export const deleteAllLogs = async (req: Request, res: Response) => {
    try{
        //  Delete all logs from the usage collection
        await otpUsageModel.deleteMany({})

        // Remove all references from every user
        await employeeModel.updateMany({}, { $set: { otpLogs: [] } })

        res.redirect('/employeelog?message=Deleted+all+logs+successfully')
    }catch(err){
        res.status(500).redirect(`/employeelog?error=error+deleting+all+logs`)
    }
}

//Search logs
export const searchLogs = async (req: Request, res: Response) => {
    try { 
    const { user, otp, startDate, endDate } = req.query
 
    const query = {}

    // Match by employee ID
    if (user) {
        query.user = user
    }

    // Match by OTP name
    if (otp) {
        query.otpName = otp
    }

    // Date range (on queriedAt)
    if (startDate || endDate) {
      query.queriedAt = {}
      if (startDate) query.queriedAt.$gte = new Date(startDate)
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999) // capture entire day
        query.queriedAt.$lte = end
      }
    }

    const logs = await otpUsageModel.find(query).populate('user').sort({ queriedAt: -1 })

    // Fetch data again to repopulate selects
    const employees = await employeeModel.find().sort({ name: 1 })
    const otps = await otpModel.find().sort({ name: 1 })

    res.render('employeeLogSearchResults', {
      req,
      logs,
      employees,
      otps
    })
    
    } catch (err) {
        console.error(err)
        res.status(500).redirect(`/employeelog?error=error+during+search`)
    }
}