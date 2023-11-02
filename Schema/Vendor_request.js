const mongoose = require('mongoose');
var schema=mongoose.Schema;
var vendorApplicationSchema = new schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },  
  commerceRegisterNumber: {
    type: String,
    required: true
  },
  commerceRegisterFile: {
    type: String, // file path/url
    required: true
  },
  ifu: {
    type: String,
    required: true
  },
  date: {
    type: Date,
  },
  type: {
    type: String,
    enum: ['formal', 'informal'],
    required: true  
  },
  idCardFile: {
    type: String, // file path/url
    required: true
  },  
  termsAccepted: {
    type: Boolean,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  request_state:{
    type: String,
    enum: ['pending', 'validated','rejected'],
  }
});

module.exports = mongoose.model('VendorRequest', vendorApplicationSchema);