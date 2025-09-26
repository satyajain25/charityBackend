import  User  from "../../models/User.js";
import { genSalt, hash } from "bcryptjs";


export const registerUser = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  if (!name || !email || !password || !mobile) {
    return res.status(400).json({ msg: "Please fill in all required fields." });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "Email is already registered." });
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
     
  
    });

    await user.save();

    res.status(201).json({
      msg: "User registered successfully",
      user: {
        name,
        email,
        mobile,
     
        role: user.role 
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Server error");
  }
};
