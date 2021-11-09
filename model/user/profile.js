'use strict';

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  username: {type: String, required: true },
  image: String,
  country: { type: String, uppercase: true },
  createdOn: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'favorite'}],
});

module.exports = mongoose.model('profile', profileSchema);