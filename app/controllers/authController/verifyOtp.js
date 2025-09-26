import User from "../../models/User.js";
import jwt from "jsonwebtoken";

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body || {};

  if (!email || !otp) {
    return res.status(400).json({ msg: "Email and OTP are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found." });

    if (user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ msg: "Invalid or expired OTP." });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, "your_jwt_secret", {
      expiresIn: "1d",
    });

    res.json({
      msg: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({ msg: "Server error." });
  }
};
