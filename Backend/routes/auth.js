import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
    console.log("User registered successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    //1. compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    //2. create token
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const isProd = process.env.NODE_ENV === "production";

    //3. Set token inside cookie
    res.cookie("token", token, {
      httpOnly: true, //protect cookie from js
      secure: isProd, //protect cookie while travelling
      sameSite: isProd ? "none" : "lax", //Prod = none, Deve = lax; used to send cookies accross different domain(vercel(frontend)-render(backend))
    });

    //4. Send response
    res.status(201).json({
      message: "User logged in successfully",
      success: true,
    });
    console.log("User logged in successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
});

//TO FETCH USERNAME
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    name: req.user.name,
  });
});

//LOGOUT
router.post("/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });

  res.status(200).json({ success: true });
});

export default router;
