import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  // NOTE: Passwords are hashed by the API route before save (using bcrypt).
  // We intentionally omit the pre-save hook here to avoid Mongoose 9 + bcryptjs
  // type incompatibilities in strict TypeScript mode.
  password: { type: String, required: true },
  role: { type: String, default: 'customer' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
