var express = require('express');
var router = express.Router();
var customerModel= require('../Schema/Customer_table');
var VendorRequest = require("../Schema/Vendor_request");
var Cart = require("../Schema/Cart")
var AdminModel= require('../Schema/Admin_table');
const bcrypt = require('bcrypt');
/* GET home page. */
router.get('/registration', function(req, res, next) {
   
    res.render('Customer_registration');
});
router.post('/registration',async (req, res) => {
    console.log(req.body);
    const isVendorChecked = req.body.isVendor;
    const customer_data={
        Customer_id              :     req.body.Customer_id,
        Customer_name            :     req.body.Customer_name,
        Customer_first_name      :     req.body.Customer_first_name,
        Customer_last_name       :     req.body.Customer_last_name,
        Customer_name            :     req.body.Customer_name,
        Customer_contact_no      :     req.body.Customer_contact_no, 
        Customer_email           :     req.body.Customer_email,
        Customer_address         :     req.body.Customer_address,
        Customer_dob             :     req.body.Customer_dob,
        Customer_gender          :     req.body.Customer_gender, 
        isVendor                 :     isVendorChecked === "on",
        verify                   :     true,
    }
    var customerdata=customerModel(customer_data);  
    customerdata.save(function(err){
        if(err)
        console.log(err);
        else
        res.redirect('registration');
    });
});

//display data
router.get('/data_display', async (req, res) => {
    try {
      const db_customer_array = await customerModel.find().sort({ _id: -1 });
      console.log(db_customer_array);
      res.render('Customer_display', {customer_array: db_customer_array});  
    } catch (err) {
      console.log("Error", err);
    }
});
  
router.get('/delete/:id', async (req, res) => {
    try {
        const user_id = req.params.id;
        await VendorRequest.deleteMany({user: user_id});
        
        await Cart.deleteMany({user: user_id});
        
        const db_customer_array = await customerModel.findByIdAndDelete(req.params.id);
        console.log("Deleted", db_customer_array);  
        res.redirect('/customer/data_display');
    } catch (err) {
        console.log("Error in delete data");
    }
});
  
router.get('/edit/:id', async (req, res) => {
    try {
        const db_customer_array = await customerModel.findById(req.params.id);
        console.log("before edit:", db_customer_array);
        res.render('Customer_edit', {customer_array: db_customer_array});
    } catch (err) { 
        console.log("Error", err);
    }
});
router.post('/edit/:id',function(req,res){
    console.log("Edit ID is"+req.params.id);
        const customer_data={
            Customer_id              :     req.body.Customer_id,
            Customer_name            :     req.body.Customer_name,
            Customer_contact_no      :     req.body.Customer_contact_no,
            Customer_email           :     req.body.Customer_email,
            Customer_address         :     req.body.Customer_address,
            Customer_dob             :     req.body.Customer_dob,
            Customer_gender          :     req.body.Customer_gender, 
            Customer_password        :     req.body.Customer_password,
        }
    customerModel.findByIdAndUpdate(req.params.id,customer_data,function(err){
            if(err)
            {
            console.log(req.params.id);
                console.log("Error in Record Update");
            }
        else
            res.redirect('/customer/data_display');
        });
});    

router.get('/show/:id',function(req,res){

    console.log(req.params.id);
    customerModel.findById(req.params.id,function(err,db_customer_array){
        if(err)
        console.log("Error in single Record Fetch");
        else
        {
            console.log(db_customer_array);
            res.render('Customer_singledata',{customer_array:db_customer_array});
        }
    })
})
//single-record
module.exports = router;    