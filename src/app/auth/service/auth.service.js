import { compare, hash } from "bcrypt";
import crypto from "crypto";
import * as authRepo from "../repository/auth.repository.js";
import * as otpRepo from "../repository/otp.repository.js";
import { timeToMS } from "../../../common/utails/time.js";
import { sendEmail } from "../../../common/email/email.js";
import jwt from "jsonwebtoken";
import { generate0TPCode } from "../../../common/utails/otps.js";

export async function register(userData) {
    // check if user already exists
    const user = await authRepo.findUserByEmail(userData.email);


    // if user exists, throw error
    if (user) {
        throw new Error("User already exists");
    }

    // hash password
    userData.password = await hash(userData.password, 10);

    // create user
    const createdUser = await authRepo.createUser(userData);

    // create OTP for email verification
    const otp = crypto.randomInt(100000, 999999).toString();
    await otpRepo.createOTP({
        code: otp,
        email: userData.email,
        expiredAt: new Date(Date.now() + timeToMS(5, "min"))
    })

    //verify OTP from email 
    await sendEmail(userData.email, "Verify your email", `<p>Your OTP is: <h1>${otp}</h1></p>`);

    return createdUser;
}

export async function verifyOTP(email, otp) {
    // check user exist
    const userExist = await authRepo.findUserByEmail(email)
    if (!userExist) {
        throw new Error("User is not exists");
    }

    //check if user verified
    if (userExist.isVerified === true) {
        throw new Error("You are already verified");

    }

    //check OTP exist
    const OTP = await otpRepo.findOtpByEmail(email)
    if (!OTP) {
        throw new Error("You need to sign up first");
    }


    // make user verified
    if (OTP.code == otp) {
        await authRepo.updateUserStatus(userExist.email, userExist.isVerified = true)
    }

    await otpRepo.deleteOTP(email)

    return userExist

}

export async function login(email, password) {

    //check if user exist and ferified
    const checkUser = await authRepo.findUserByEmail(email)
    if (!checkUser) {
        throw new Error("user is not exist", 400)
    }
    if (checkUser.isVerified == false) {
        throw new Error("user is not verified yet", 400)

    }

    //check pasword
    const checkPass = await compare(password, checkUser.password)
    if (!checkPass) {
        throw new Error("password is not correct", 400)
    }
    //generate JWT token
    const payload = {
        userId: checkUser._id,
        email: checkUser.email
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })

    return token

}

export async function send0tp(email) {
    // 1. check user existence
    const user = await authRepo.findUserByEmail(email);// {} | null
    if (!user) throw new Error('user is not exist', { cause: 404 });

    // delete old OTPs
    await otpRepo.deleteOTP(email)

    // 2. generate OTP and save it into DB
    const code = await generate0TPCode();
    await otpRepo.createOTP({
        code: code,
        email: user.email,
        expiredAt: new Date(Date.now() + timeToMS(5, "min"))
    })
    // 3. send otp email
    await sendEmail(user.email, "Verify your email", `<p>Your OTP is: <h1>${code}</h1></p>`);

    return code
}