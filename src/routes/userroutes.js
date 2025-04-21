const express = require('express');
const {userProfile,forgotPassword,verifyOtp,resetPassword} = require('../controllers/usercontroller')

const userRouter = express.Router();

const authMiddleware = require('../middlewares/authmiddleware');


userRouter.get('/profile', authMiddleware, userProfile);
userRouter.post('/forget-pass',forgotPassword );
userRouter.post('/verify-otp',verifyOtp );
userRouter.post('/reset-pass',resetPassword );



module.exports= userRouter