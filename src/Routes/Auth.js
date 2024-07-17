const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../Models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, pin, mobileNumber, email } = req.body;

  try {
    // Hash the pin
    const hashedPin = await bcrypt.hash(pin, 10);

    // Create a new user
    const newUser = new User({
      name,
      pin: hashedPin,
      mobileNumber,
      email,
    });

    // Save the user
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully. Await admin approval." });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { identifier, pin } = req.body; // identifier can be either mobileNumber or email

  try {
    // Find the user
    const user = await User.findOne({
      $or: [{ mobileNumber: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the pin matches
    const isMatch = await bcrypt.compare(pin, user.pin);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid pin" });
    }

    // Check if the user is approved
    if (user.status !== "approved") {
      return res.status(403).json({ message: "User not approved" });
    }

    res.status(200).json({ user:{name: `${user.name}`, email: `${user.email}`,mobileNumber:`${user.mobileNumber}`} });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

module.exports = router;
