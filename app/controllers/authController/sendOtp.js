import User from "../../models/User.js";
import crypto from "crypto";
import  { sendOtpUser }from "../../utils/sendEmail.js";
// Simulate sending email or SMS (replace with real service)
// const sendOtpToUser = async (email, otp) => {
//   console.log(`Sending OTP ${otp} to ${email}`);
//   // Integrate your actual email or SMS service here
// };

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found." });

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOtpUser(email, otp); // Mock function

    return res.json({ msg: "OTP sent successfully." });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({ msg: "Server error." });
  }
};
