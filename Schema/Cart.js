const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Customer' },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number
    }
  ],
});
module.exports = mongoose.model('Cart', CartSchema);