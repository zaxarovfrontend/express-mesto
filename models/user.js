const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // имя пользователя
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  }
})

module.exports = mongoose.model('user', userSchema);