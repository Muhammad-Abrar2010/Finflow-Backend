
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
console.log("connected to user.js");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  pin: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 'pending',
  },
});

module.exports = mongoose.model('User', UserSchema);
