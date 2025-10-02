import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createAdminUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log("error creating admin user", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const loginAdminUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Your email or password is incorrect" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res
        .status(401)
        .json({ message: "Your email or password is incorrect" });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
     
    await user.save();

    const userData = user.toObject();
    delete userData.password;

    // Return user and token
    return res.status(200).json({
      message: "Login successful",
      token,
      user: userData, 
    });
  } catch (error) {
    console.log("error logging in admin user", error.message);
    return res.status(500).json({ message: error.message });
  }
};
