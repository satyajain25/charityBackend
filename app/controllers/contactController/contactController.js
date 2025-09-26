import Contact from '../../models/Contact.js';
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, mobile, issue } = req.body;

    if (!name || !email || !mobile || !issue) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newContact = new Contact({ name, email, mobile, issue });
    await newContact.save();

    res.status(201).json({ message: "Contact form submitted successfully." });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Server error while submitting contact form." });
  }
};
