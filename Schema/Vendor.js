const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    
  },
  phoneNumber: {
    type: String,
    required: true
  },
  // Autres champs spécifiques aux vendeurs
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;