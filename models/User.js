const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorite_fruit: { type: String, required: true },
  _created_on: { type: Date, required: true },
  last_login: Date,
  login_count: Number,
  messages_sent: Number
})

module.exports = mongoose.model('User', schema);
