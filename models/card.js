const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { // название карточки
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    minlength: 2,
    maxlength: 30,
    ref: 'user'
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: [],
    ref: 'user'
  },
  createdAt : {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('card', cardSchema);