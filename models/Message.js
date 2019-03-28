const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user_id: { type: String, required: true },
  timestamp: { type: Date, required: true },
  text: { type: String, required: true }
})

module.exports = mongoose.model('Message', schema)
