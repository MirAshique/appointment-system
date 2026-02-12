import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 🔒 CHECK PASSWORD
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 🔒 CHECK ROLE
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Not an admin account" });
  }

  // ✅ SUCCESS RESPONSE (THIS IS WHAT FRONTEND NEEDS)
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role, // 🔥 REQUIRED
    token: generateToken(user._id),
  });
};
