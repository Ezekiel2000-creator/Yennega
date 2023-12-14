var express = require('express');
var router = express.Router();
var productModel= require('../Schema/Product_table');
var Customer= require('../Schema/Customer_table');
var Category= require('../Schema/SubCategory_table');
var Vendor= require('../Schema/Vendor');
/* GET home page. */

router.get('/add_product', async (req, res) => {
    try {
      const vendors = await Customer.find({isVendor: true});
      const categories = await Category.find({});
      
      console.log("vendorsssssssssssssssss",vendors);
      res.render('Product_add', { 
        vendors,
        categories 
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching data"); 
    }
  });

// router.post('/regi_process',function(req,res,next){
//     console.log(req.files.Pro_image);
//     console.log("-------------------");
        
//     var img = req.files.Pro_image;
//     var pro_image= img.name;
//     console.log("File Name :" +pro_image);    
//     console.log(req.body);
//     const product_data=
//     {
//         Product_id     :  req.body.Product_id,
//         Customer_id    :  req.body.Customer_id,
//         Cate_id        :  req.body.Cate_id,
//         Pro_name       :  req.body.Pro_name,
//         Pro_image      :  pro_image,
//         Pro_quantity   :  req.body.Pro_quantity,
//         Pro_date       :  new Date(Date.now()).toLocaleString(),
//         Pro_rentprice  :  req.body.Pro_rentprice,   
//         Pro_ammount    :  req.body.Pro_ammount,
//         Pro_vendor     :  req.body.Pro_vendor,
//         Pro_description:  req.body.Pro_descrption,
//         Pro_subcategory:  req.body.Pro_subcategory,
//     }
//     var productdata=productModel(product_data);  
//     img.mv("public/Pro_upload/"+pro_image, function(err) {
//         if (err)
//         {
//         return res.status(500).send(err);
//         }
//         else
//         {
//             productdata.save(function(err){
//             if(err)
//             console.log(err);
//             else
//             res.redirect('/product/add_product');
//             });
//         }
//     });
// });
    
router.post('/regi_process', async (req, res) => {

    try {
  
        console.log(req.files.Pro_image);
        console.log("-------------------");
        var img = req.files.Pro_image;
        var pro_image= img.name;
        await img.mv("public/Pro_upload/" + pro_image);
        console.log("File Name :" +pro_image);    
        console.log(req.body);
        const product_data=
        {
            Product_id     :  req.body.Product_id,
            Customer_id    :  req.body.Customer_id,
            Cate_id        :  req.body.Cate_id,
            Pro_name       :  req.body.Pro_name,
            Pro_image      :  pro_image,
            Pro_quantity   :  req.body.Pro_quantity,
            Pro_date       :  new Date(Date.now()).toLocaleString(),
            Pro_rentprice  :  req.body.Pro_rentprice,   
            Pro_ammount    :  req.body.Pro_ammount,
            Pro_vendor     :  req.body.Pro_vendor,
            Pro_description:  req.body.Pro_description,
            Pro_subcategory:  req.body.Pro_subcategory,
        }
      
        const productdata = await productModel.create(product_data);
        if(!productdata) {
            throw "Error saving data"; 
          }
        await productdata.save();
  
      res.redirect('/product/add_product');
  
    } catch (err) {
      console.error(err);
      res.status(500).send("Error saving data"); 
    }
  
  });
//display data

router.get('/data_display', async (req, res) => {

    try {
      
      const db_product_array = await productModel.find().sort({ _id: -1 });
      console.log(db_product_array);
  
      res.render('Product_display', {
        product_array: db_product_array
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching data");
    }
  
  });
//display data

//delete data
router.get('/delete/:id', async (req, res) => {

    try {
      
      const db_product_array = await productModel.findByIdAndDelete(req.params.id);
      console.log(db_product_array);
  
      res.redirect('/product/data_display');
  
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting data");
    }
  
});
//delete data
router.get('/edit/:id', async (req, res) => {

    try {
      
      const db_product_array = await productModel.findById(req.params.id);
      const categories = await Category.find({});
      const vendors = await Customer.find({isVendor: true});
  
      res.render('Product_edit', {
        product_array: db_product_array, 
        categories,
        vendors
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching data");
    }
  
});

router.post('/edit/:id', async function(req, res) {
  console.log("Edit ID is "+req.params.id);
  if (req.files.Pro_image) {
      var img = req.files.Pro_image;
      var pro_image= img.name;
      console.log("-----------------------------"+pro_image);
      console.log(pro_image);
      const product_data = {
          Product_id: req.body.Product_id,
          Customer_id: req.body.Customer_id,
          Cate_id: req.body.Cate_id,
          Pro_name: req.body.Pro_name,
          Pro_image: pro_image,
          Pro_quantity: req.body.Pro_quantity,   
          Pro_date: new Date(Date.now()).toLocaleString(),
          Pro_rentprice: req.body.Pro_rentprice,   
          Pro_ammount: req.body.Pro_ammount,
          Pro_vendor: req.body.Pro_vendor,
          Pro_description: req.body.Pro_description,
          Pro_subcategory: req.body.Pro_subcategory,
      }
      console.log("Update data is "+product_data);

      var productdata = productModel(product_data);  

      try {
          await img.mv("public/Pro_upload/"+pro_image);
          await productModel.findByIdAndUpdate(req.params.id, product_data);
          console.log("Updated record.");
          res.redirect('/product/data_display');
      } catch (err) {
          console.log("Error in Record Update");
          res.status(500).send(err);
      }
  } else {
      console.log("-----------------------------------");
      var past_image = req.body.past_image;
      const product_data = {
          Product_id: req.body.Product_id,
          Customer_id: req.body.Customer_id,
          Cate_id: req.body.Cate_id,
          Pro_name: req.body.Pro_name,
          Pro_image: past_image,
          Pro_quantity: req.body.Pro_quantity,   
          Pro_date: new Date(Date.now()).toLocaleString(),
          Pro_rentprice: req.body.Pro_rentprice,   
          Pro_ammount: req.body.Pro_ammount,
          Pro_vendor: req.body.Pro_vendor,
          Pro_description: req.body.Pro_description,
          Pro_subcategory: req.body.Pro_subcategory,
      }
      console.log("Update data is "+product_data);

      var productdata = productModel(product_data);  

      try {
          await productModel.findByIdAndUpdate(req.params.id, product_data);
          console.log("Updated record.");
          res.redirect('/product/data_display');
      } catch (err) {
          console.log("Error in Record Update");
          res.status(500).send(err);
      }
  }
});

//edit data
//single-record
router.get('/show/:id', async function(req, res) {
  console.log(req.params.id);
  try {
      const db_product_array = await productModel.findById(req.params.id).populate("Pro_vendor");
      console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",db_product_array);
      res.render('Product_singledata', {product_array:db_product_array});
  } catch (err) {
      console.log("Error in single Record Fetch");
      res.status(500).send(err);
  }
});
//single-record
module.exports = router;