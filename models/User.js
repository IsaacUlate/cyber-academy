import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'journalist', 'user'], default: 'user' },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
