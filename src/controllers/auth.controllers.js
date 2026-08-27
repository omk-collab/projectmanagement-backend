import {User} from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError} from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { hash } from "bcrypt";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";
import jwt from "jsonwebtoken"
import crypto from "crypto";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({
      validateBeforeSave: false,
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token",
    );
  }
};

const registerUser = asyncHandler(async(req,res)=>{
    const {email, username, password, role}=req.body

   console.log("Email:", email);
   console.log("Username:", username);

   const existedUser = await User.findOne({
     $or: [{ username }, { email }],
   });

   console.log("Found User:", existedUser);
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists",[])
    }

     const newUser = await User.create({
        email,
        password,
        username,
        isEmailVerified: false

    })

   const {unHashedToken, hashToken,tokenExpiry} = newUser.generateTemporaryToken();

  newUser.emailVerificationToken = hashToken;
  newUser.emailVerificationExpiry = tokenExpiry;

  await newUser.save({
    validateBeforeSave: false,
  });

 await sendEmail({
   email: newUser.email,
   subject: "Please verify your email",
   mailgenContent: emailVerificationMailgenContent(
     newUser.username,
     `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`,
   ),
 });

    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registring a user")
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { user: createdUser },
          "User registred successfully and verification email has been sent on your email",
        ),
      );
   
});

const login = asyncHandler(async (req,res)=>{

 const {email,password}= req.body

 if( !email){
  throw new ApiError(400," email is required")
 }

 const user = await User.findOne({email});
 
 if(!user){
    throw new ApiError(400, " email does not exists");
 }

 const isPasswordValid = await user.isPasswordCorrect(password);

 if(!isPasswordValid){
      throw new ApiError(400, "  Invalid credentials");

 }

 const {accessToken, refreshToken}= await generateAccessAndRefreshTokens(user._id)

     const loggedInUser = await User.findById(user._id).select(
       "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
     );

     const options = {
       httpOnly: true,
       secure: true,
       sameSite: "none",
     };
     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(
      new ApiResponse(
        200,{
          user: loggedInUser,
          accessToken,
          refreshToken
        },
        "User logged in successfully"
      )
     )
});

const logoutUser = asyncHandler(async (req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:"",
      },
    },
    {
      new:true,
    },
  );
 const options = {
   httpOnly: true,
   secure: true,
   sameSite: "none",
 };
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User logged out"));
});

const getCurrentUser = asyncHandler (async (req, res)=>{
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      req.user,
      "Current user fetched successfully"
    )
  )
});

const verifyEmail = asyncHandler (async (req, res) =>{
  const {verificationToken} = req.params

  if(!verificationToken){
    throw new ApiError(400, "Email verification token is missing")
  }
  let hashToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex")

    const user = await User.findOne({
      emailVerificationToken: hashToken,
      emailVerificationExpiry: {$gt: Date.now()}
    })
    if(!user){
      throw new ApiError(400,"Token is invalid or expired"); 
    }
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    user.isEmailVerified = true;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          isEmailVerified: true,
        },
        "Email is verified",
      ),
    );
});

const resendEmailverification= asyncHandler(async (req, res) => {
  
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  if (user.isEmailVerified) {
    throw new ApiError(409, "Email is already verified");
  }
const { unHashedToken, hashToken, tokenExpiry } = user.generateTemporaryToken();

  user.emailVerificationToken = hashToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({
    validateBeforeSave: false,
  });

  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`,
    ),
  });
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      {},
      "Mail has been sent to your email ID"
    )
  )
});

const refreshAccessToken = asyncHandler (async (req, res) =>{
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken){
    throw new ApiError(401, "Unauthorized access")
  }

  try{
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)


   const user = await User.findById(decodedToken?._id);
   if (!user) {
     throw new ApiError(401, "Invalid refresh token");
   }
    if(incomingRefreshToken !== user?.refreshToken){
    throw new ApiError(401, "Refresh token is expired");
    }
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };
    const {accessToken, refreshToken: newRefreshToken} = await
    generateAccessAndRefreshTokens(user._id)

    user.refreshToken = newRefreshToken;
    await user.save({
      validateBeforeSave: false,
    });

    return res
    .status(200)
    .cookie ("accessToken", accessToken, options)
    .cookie ("refreshToken", newRefreshToken,options)
    .json(
      new ApiResponse(
        200,
        {accessToken,refreshToken: newRefreshToken },
        "Access token refreshed"
      )
    )

  } catch (error){
    throw new ApiError(401, "Invalid refresh token");
  }

})

const forgotPasswordRequest = asyncHandler (async (req, res)=>{
  const {email} = req.body

  const user = await User.findOne({email})

  if(!user){
    throw new ApiError(404,"User does not exists",[])
  }
  
  const {unHashedToken, hashToken, tokenExpiry} = 
  user.generateTemporaryToken();

  user.forgotPasswordToken = hashToken
  user.forgotPasswordExpiry = tokenExpiry

  await user.save({validateBeforeSave: false})

  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`,
    ),
  });
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      {},
      "password reset mail has been sent on your mail id"
    )
  )
})

const resetForgotPassword = asyncHandler (async (req, res) =>{
  const {resetToken} = req.params
  const {newPassword} = req.body

  let hashToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex")

  const user = await User.findOne({
    forgotPasswordToken: hashToken,
    forgotPasswordExpiry: {$gt: Date.now()}
  })

  if(!user){
    throw new ApiError(400,"Token is invalid or expired")
  }
    
  user.forgotPasswordExpiry = undefined
  user.forgotPasswordToken = undefined

  user.password = newPassword

  await user.save({validateBeforeSave: false})

  return res
  .status(200)
  .json(new ApiResponse(200,{},"Password reset successfully"));

})

const changeCurrentPassword = asyncHandler (async (req,res)=>{
  const {oldPassword, newPassword} = req.body

  const user = await User.findById(req.user?._id);

  const isPasswordValid = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordValid){
    throw new ApiError(400,"Invalid old Password")
  }

  user.password = newPassword;
  await user.save({validateBeforeSave: false});

  return res
  .status(200)
  .json(new ApiResponse(200,{},"Password changed successfully"));
});


export {
  registerUser,
  login,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailverification,
  refreshAccessToken,
  forgotPasswordRequest,
  changeCurrentPassword,
  resetForgotPassword,
};