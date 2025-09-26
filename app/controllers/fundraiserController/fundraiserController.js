
import Fundraiser from '../../models/Fundraiser.js';
import bcrypt from 'bcrypt';
/* 
export const registerFundraiser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mobile,
      emergency,
      totalAmount,
      description,
      paragraph,
      accountDetails,
      daysLeft = 30 // Default to 30 days if not provided
    } = req.body;

    const existing = await Fundraiser.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("req.file===",req.file);
    
   console.log("req.file.fileUrl=====",req.file.fileUrl);

    // Store the relative path from multer
    const photo = req.file ? req.file.fileUrl : null;
   

    const fundraiser = new Fundraiser({
      name,
      email,
      password: hashedPassword,
      mobile,
      emergency,
      photo,
      totalAmount: Number(totalAmount),
      description,
      paragraph,
      accountDetails: typeof accountDetails === 'string' ? JSON.parse(accountDetails) : accountDetails,
      daysLeft: Number(daysLeft)
    });

    await fundraiser.save();
    res.status(201).json({
      message: 'Fundraiser registered',
      id: fundraiser._id,
      fundraiser: {
        ...fundraiser.toObject(),
        password: undefined
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
};

 */

export const registerFundraiser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mobile,
      emergency,
      totalAmount,
      description,
      paragraph,
      accountDetails,
      daysLeft = 30,
    } = req.body;
    const existing = await Fundraiser.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const photo = req.file ? req.file.fileUrl : null;

    const fundraiser = new Fundraiser({
      name,
      email,
      password: hashedPassword,
      mobile,
      emergency,
      photo,
      totalAmount: Number(totalAmount),
      description,
      paragraph,
      accountDetails:
        typeof accountDetails === 'string'
          ? JSON.parse(accountDetails)
          : accountDetails,
      daysLeft: Number(daysLeft),
    });

    await fundraiser.save();
    res.status(201).json({
      message: 'Fundraiser registered',
      id: fundraiser._id,
      fundraiser: {
        ...fundraiser.toObject(),
        password: undefined,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
};
export const getFundraiser = async (req, res) => {
  try {
    const fundraiser = await Fundraiser.findById(req.params.id).select('-password');
    if (!fundraiser) return res.status(404).json({ message: 'Fundraiser not found' });   
    if (fundraiser.endDate) {
      const now = new Date();
      const endDate = new Date(fundraiser.endDate);
      const timeDiff = endDate.getTime() - now.getTime();
      const daysLeft = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
      fundraiser.daysLeft = daysLeft;
    }
    res.json(fundraiser);
  } catch (err) {
    console.error('Get fundraiser error:', err);
    res.status(500).json({ error: err.message });
  }z
};
export const getAllFundraisers = async (req, res) => {
  try {
    const fundraisers = await Fundraiser.find().select('-password');

    // Process each fundraiser to calculate days left and format data
    const processedFundraisers = fundraisers.map(fundraiser => {
      const fundraiserObj = fundraiser.toObject();

      // Calculate days left if endDate exists
      if (fundraiserObj.endDate) {
        const now = new Date();
        const endDate = new Date(fundraiserObj.endDate);
        const timeDiff = endDate.getTime() - now.getTime();
        const daysLeft = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
        fundraiserObj.daysLeft = daysLeft;
      }

      return fundraiserObj;
    });

    res.json(processedFundraisers);
  } catch (err) {
    console.error('Get all fundraisers error:', err);
    res.status(500).json({ error: err.message });
  }
};