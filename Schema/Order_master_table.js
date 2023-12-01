const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Customer' },
  user_name: String,
  cart: [],
  date: Date,
  total: Number,
  grand_Toatal: Number,
  deliveryAddress: String,
  status: String
});
module.exports = mongoose.model('Order', OrderSchema);