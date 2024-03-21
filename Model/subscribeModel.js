const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  senderEmail: { type: String, required: true },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
