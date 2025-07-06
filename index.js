import express from 'express'
import mongoose from 'mongoose'
import router from './routes/routes.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json()) // For parsing JSON bodies
app.use(express.urlencoded({ extended: true })) // For parsing URL-encoded form data
app.set("view engine", "ejs") // setting view engine
app.set('views', 'views') // setting views folder
app.use(express.static('public'))
app.use(cookieParser())

// Database connection
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
  console.log(`Connected to the mongo database successfully`)
}).catch((err)=>{
  console.log(`Database connection error: ${err}`)
})

app.use("/", router)

app.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
