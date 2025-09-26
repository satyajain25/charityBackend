import { Schema, model } from 'mongoose';

const donationSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  fundraiserName: { type: String, required: true },
  orderId: String, 
  paymentStatus: { type: String, default: 'pending' },
  paymentId: String,
}, {
  timestamps: true
});

const Donation = model('Donation', donationSchema);

export default Donation;
