const mongoose = require('mongoose');
const express = require('express');

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  // Otros campos necesarios para el mensaje...
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
