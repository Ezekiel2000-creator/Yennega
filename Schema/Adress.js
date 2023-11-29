const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliveryCostSchema = new Schema({
  value: { type: Number, required: true },
});

const LocalitySchema = new Schema({
  name: { type: String, required: true },
  deliveryCost: { type: DeliveryCostSchema, required: true },
});

const CitySchema = new Schema({
  name: { type: String, required: true },
  localities: { type: [LocalitySchema], default: [] },
});

module.exports = mongoose.model('City', CitySchema);
