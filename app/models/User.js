import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String },  
  role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },

  otp: { type: String },
  otpExpires: { type: Date },
     
});

const User = model('user', UserSchema);
export default User;
