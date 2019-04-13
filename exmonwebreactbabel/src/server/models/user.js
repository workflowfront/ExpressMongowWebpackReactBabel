import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  psw: { type: String, required: true },
  updateDate: Date
});
userSchema.plugin(uniqueValidator);

module.exports = userSchema;
