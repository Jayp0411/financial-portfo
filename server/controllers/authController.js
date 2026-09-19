import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function createToken(id) {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:"7d"});
}

export async function register(req,res) {
  try {
    const {name,email,password} = req.body;
    if (!name || !email || !password) return res.status(400).json({message:"Name, email and password are required."});
    if (password.length < 6) return res.status(400).json({message:"Password must be at least 6 characters."});

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({email:normalizedEmail})) return res.status(409).json({message:"An account with this email already exists."});

    const passwordHash = await bcrypt.hash(password,12);
    const user = await User.create({name:name.trim(),email:normalizedEmail,passwordHash});
    const token = createToken(user._id.toString());

    res.status(201).json({token,user:{id:user._id,name:user.name,email:user.email}});
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Unable to create account."});
  }
}

export async function login(req,res) {
  try {
    const {email,password} = req.body;
    const user = await User.findOne({email:email?.trim().toLowerCase()});
    if (!user || !(await bcrypt.compare(password,user.passwordHash))) {
      return res.status(401).json({message:"Invalid email or password."});
    }
    const token = createToken(user._id.toString());
    res.json({token,user:{id:user._id,name:user.name,email:user.email}});
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Unable to login."});
  }
}

export async function me(req,res) {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({message:"User not found."});
    res.json({user:{id:user._id,name:user.name,email:user.email}});
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Unable to fetch user."});
  }
}
