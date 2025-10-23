import bcrypt from "bcryptjs";
import User from "../models/user.js";
import dotenv from "dotenv";
import { createJWT } from "../utils/index.js";
import { sendEmail } from "../utils/resend.js";

dotenv.config();

export const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({email});
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      email,
      password: hashedPassword,
      verificationCode: code,
      verificationCodeExpires: expiry,
    });
    await newUser.save();

    await sendEmail(
      email,
      'Your Verification Code',
      `Your code is: ${code}`,
      `<p>Your verification code is: <b>${code}</b></p>`
    );

    res.json({ msg: 'Signup successful. Check your email for the code.' });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({msg:'Signup unsuccessful, Try again'});
  }
};

export const login = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ msg: "Email is required" });

  try {
    let user = await User.findOne({ email });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);

    if (!user) {
      user = new User({
        email,
        code,
        codeExpires,
      });
    } else {
      user.code = code;
      user.codeExpires = codeExpires;
    }

    await user.save();

    await sendEmail(
      email,
      'Your Login Code for Maison Sommeil',
      `Your login code is: ${code}. It will expire in 10 minutes.`,
      `
      <div>
        <p>Hi fam,</p>
        <p>Your login code is: <b>${code}</b>. It will expire in 10 minutes.</p>
        <p>Thanks for shopping with Maison Sommeil!</p>
      </div>
      `
    );

    console.log("Code sent to email:", email);
    console.log(`Code for ${email}: ${code}`);
    res.status(200).json({ msg: "Login code sent to email", email });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const verify = async(req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ msg: "Email and code required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    console.log("Submitted code:", code);
    console.log("Stored code:", user.code);
    console.log("Code expiry:", user.codeExpires);
    console.log("Current time:", new Date());

    if (user.code !== code || user.codeExpires < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired code" });
    }

    createJWT(res, user._id);

    console.log("Cookie set!");
    console.log("Cookies received:", req.cookies);

    user.isVerified = true;
    user.code = null;
    user.codeExpires = null;
    await user.save();

    res.status(200).json({ 
      msg: "Login successful", 
      user: {
        id: user._id, 
        email: user.email, 
        isAdmin: user.isAdmin,
        role: user.role,
        joinedOn: user.joinedOn ? user.joinedOn.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null,
      } 
    });

  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ msg: "Server error" });
  }
};