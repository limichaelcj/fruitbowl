const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  _created_on: { type: Date, required: true },
  last_login: Date,
  login_count: Number,
  total_messages: Number
})

module.exports = mongoose.model('User', schema);
