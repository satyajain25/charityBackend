import { Schema, model } from 'mongoose';

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  issue: { type: String, required: true }
}, {
  timestamps: true
});

const Contact = model('Contacts ', contactSchema);
export default Contact;
