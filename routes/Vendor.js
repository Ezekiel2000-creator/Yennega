const express = require('express');
const router = express.Router();

const Customer = require('../Schema/Customer_table');

async function getVendors() {

  try {

    const vendors = await Customer.find({
      isVendor: true
    });

    return vendors;

  } catch (error) {
    throw error;
  }

}

router.get('/data_display', async (req, res) => {

  try {

    const vendors = await getVendors();

    res.render('Vendor_display', {
      vendors
    });

  } catch (err) {
    res.status(500).send(err);
  }

});

module.exports = router;