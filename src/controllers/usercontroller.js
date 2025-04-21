const UserModel = require("../models/usermodel");
const AppError = require("../utils/apierror");
const sendEmail = require('../utils/nodemailer')


const userProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      throw AppError.notFound("User not found");
    }

    return res
      .status(200)
      .json({ message: "User profile fetched", success: true, data: user });
  } catch (error) {
    next(error);
  }
};


const forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        throw AppError.notFound("No user with that email");
      }
  
      
      const resetToken =  Math.floor(100000 + Math.random() * 900000).toString();
  
      
      user.resetPasswordToken = resetToken
      user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; 
      await user.save({ validateBeforeSave: false });
  
      
  
      
      await sendEmail({
        to: user.email,
        subject: "Password Reset",
        text: ` Reset otp is here: ${resetToken}`,
        html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Password Reset OTP</h2>
          <p>Hello ${user.name || "User"},</p>
          <p>Your OTP for password reset is:</p>
          <h3 style="color: #2c3e50;">${resetToken}</h3>
          <p>This OTP is valid for 5 minutes.</p>
          <p>If you didn’t request this, please ignore this email.</p>
          <br>
          <p>– Nodejs Team</p>
        </div>
      `,
      });
  
      res.status(200).json({ success: true, message: "Reset email sent" });
    } catch (error) {
      next(error);
    }
  };

  const verifyOtp = async (req, res, next) => {
    try {
      const { email, otp } = req.body;
  
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        throw AppError.notFound("User not found");
      }
  
      
      if (
        user.resetPasswordToken !== otp ||
        !user.resetPasswordExpires ||
        user.resetPasswordExpires < Date.now()
      ) {
        throw AppError.badRequest("OTP is invalid or has expired");
      }
  
      res.status(200).json({
        success: true,
        message: "OTP is valid",
      });
    } catch (error) {
      next(error);
    }
  };
  

  const resetPassword = async (req, res, next) => {
    try {
      const { email, newPassword } = req.body;
  
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        throw AppError.notFound("User not found");
      }
  
      
      if (!user.resetPasswordToken || !user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
        throw AppError.badRequest("OTP is invalid or has expired");
      }
     
      


      
      user.password = newPassword;
  
      
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();

      await sendEmail({
        to: user.email,
        subject: "Your Password Has Been Changed",
        text: `Hello ${user.name || "User"}, your password was just changed.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Password Changed Successfully</h2>
            <p>Hello ${user.name || "User"},</p>
            <p>This is a confirmation that your password was changed.</p>
            <p>If you did not perform this action, please contact our support team immediately.</p>
            <br>
            <p>– Nodejs Team</p>
          </div>
        `,
      });
  
      res.status(200).json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      next(error);
    }
  };


module.exports=  {userProfile,forgotPassword,verifyOtp,resetPassword}