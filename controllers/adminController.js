import otpModel from '../models/otpModel.js'
import employeeModel from '../models/employeeModel.js'
import settingsModel from '../models/settingsModel.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const signJwt = (id) => {
    return jwt.sign({id}, process.env.JWTSECRET, {expiresIn: 60*60*24}) //1 day
}

export const getLoginPage = (req, res) => {
    res.render("login", {req})
}

export const postLoginPage = (req, res) => {
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

export const logout = (req, res) => {
    res.clearCookie("admin")
    res.status(200).redirect('/?message=Logged+out+successfully')
}

export const getHome = (req, res) => {
    res.render("home")
}

export const viewOtps = async (req, res) => {
    try {
        const otps = await otpModel.find()
        res.render("viewOtps", { otps })
    } catch (err) {
        console.error(err) 
        res.status(500).send("Error fetching OTPs.")
    }
}

export const viewUsers = async (req, res) => {
        try {
        const employees = await employeeModel.find()
        res.render("viewEmployees", { employees })
    } catch (err) {
        console.error(err) 
        res.status(500).send("Error fetching employees.")
    }
}

export const viewAdminOps = async (req, res) => {
    const settings = await settingsModel.findOne()
    const mode = settings.botEnabled
    res.render("adminops", {req, mode})
}

export const changePhrase = async (req, res) => {
    const { otpId, newPhrase } = req.body
    const upNewPhrase = newPhrase.toUpperCase()
    try{
        await otpModel.findByIdAndUpdate(otpId, { phrase: upNewPhrase })
        res.redirect("/adminops?message=Phrase+Updated")
    }catch(err){
        // console.log(err)
        res.redirect("/adminops?error=Otp+does+not+exist")
    }
}

export const manageEmployee = async (req, res) => {
    const { name, phone, action } = req.body;
    try{
        if (action === "add") {
            const cleanedPhoneNumber = phone.replace(/\p{Cf}/ug, ''); 

            await employeeModel.create({ name, phone: `whatsapp:${cleanedPhoneNumber}` })
            res.redirect("/adminops?message=Employee+added+successfully")
        } else if (action === "remove") {
            await employeeModel.deleteOne({ phone })
            res.redirect("/adminops?message=Employee+deleted+successfully")
        }
    }catch(err){
        // console.log(err)
        res.redirect("/adminops?error=Error+occured+while+managing+employees")
    }
}

export const addOtp = async (req, res) => {
    try{
        const { name, issuer, phrase, secret } = req.body
        await otpModel.create({ name, issuer, phrase, secret })
        res.redirect("/adminops?message=Otp+created+successfully")
    }catch(err){
        // console.log(err)
        res.redirect("/adminops?error=Error+occured+while+creating+phrase")
    }
}

export const toggleBot = async (req, res) => {
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


