const express = require('express');
const router = express.Router();

const Customer = require('../Schema/Customer_table');
const vendorRequest = require('../Schema/Vendor_request');

async function getVendors() {

  try {

    const vendor_Requests = await vendorRequest.find({
    });

    return vendor_Requests;

  } catch (error) {
    throw error;
  }

}

router.get('/data_display', async (req, res) => {

  try {

    const vendor_Requests = await getVendors().populate('user');

    res.render('Vendor_display', {
        vendor_Requests
    });

  } catch (err) {
    res.status(500).send(err);
  }

});

router.get('show/:id', async (req, res) => {

    try {
      id = req.params.id;
      const vendor_Request = await vendorRequest.find({
        user:  mongoose.Types.ObjectId(id)
      });
  
      res.render('Vendor_singledata', {
          vendor_Request
      });
  
    } catch (err) {
      res.status(500).send(err);
    }
  
});

module.exports = router;