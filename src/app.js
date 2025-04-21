const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cookieparser = require('cookie-parser')
const morgan = require('morgan')

const ratelimiter = require('express-rate-limit')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')
const router = require('./routes/authroutes')
const userRouter = require('./routes/userroutes')



const app = express()

app.use(cors({
    origin:["http://localhost:3000"],
    allowedHeaders:["Authorisation","Content-Type"],
    credentials:true
}))

app.use(morgan("dev"))
app.use(express.json({limit:"100mb"}))
app.use(express.urlencoded({limit:"100mb",extended:true}))
app.use(cookieparser())



const limiter = ratelimiter.rateLimit({
    windowMs :15*60*1000,
    max:(req)=>(req.user ? 1000:100),
    message:{error:"Too many request , please try again later"},
    standardHeaders:true,
    legacyHeaders:true,
    keyGenerator:(req)=>req.ip
})

app.use(limiter)

app.get("/",(req,res)=>{
   res.send("hello server")

})

app.use('/api/v1/auth',router)
app.use('/api/v1/user',userRouter)

app.use(errorHandler)

module.exports = app
