const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Customer' },
  user_name: String,
  cart: [],
  date: Date,
  total: Number,
  grand_Total: Number,
  deliveryAddress: String,
  status: {
    type: String,
    enum: ['pending', 'validated','rejected'],
  }
});
module.exports = mongoose.model('Order', OrderSchema);