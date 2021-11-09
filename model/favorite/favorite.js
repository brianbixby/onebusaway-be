'use strict';

const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
  favoriteId: { type: Number, required: true },
  nickname: { type: String, required: true },
  bus: { type: Number, required: true },
  stop: { type: Number, required: true },
});

module.exports = mongoose.model('favorite', favoriteSchema);