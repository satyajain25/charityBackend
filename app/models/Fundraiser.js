import { Schema, model } from 'mongoose';

const FundraiserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  emergency: { type: String, enum: ['medical', 'education'], default: 'medical' },
  photo: { type: String, required: false },
  amountCollected: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  description: { type: String },
  paragraph: { type: String },
  daysLeft: { type: Number, default: 30 }, 
  createdAt: { type: Date, default: Date.now }, 
  endDate: { type: Date }, 
  accountDetails: {
    accountNumber: { type: String },
    ifsc: { type: String },
    bankName: { type: String },
    accountHolderName: { type: String }
  }
});

const Fundraiser = model('fundraiser', FundraiserSchema);
export default Fundraiser;