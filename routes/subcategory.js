var express= require('express');
var router=express.Router();
var categoryRouter=require('../Schema/Category_table');
var subcategoryModel=  require('../Schema/SubCategory_table');
var Cart= require('../Schema/Cart');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const requireAuth = (req, res, next) => {
    const token = req.cookies.token;
    console.log("vvvvvvvvvvv",token);
    
    if (token) {
      jwt.verify(token, 'your_secret_key', (err, decodedToken) => {
        if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).redirect("/signin");
        } else {
          return res.status(401).json({ message: 'Token invalide' });
        }
        }
        req.user = decodedToken;
        try {
        const userCart = Cart.findOne({ user: req.user.id }).populate('items');
      
        if (userCart === null || userCart.items === 0) {
          const carts = [];
          app.locals.carts = carts;
        }
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
        next();
      });
      } else {
      req.session.returnTo = req.originalUrl;
      res.status(401).redirect("/signin");
      }
};

// router.use(requireAuth);
//add-subcategory

router.get('/add_subcategory', async (req, res, next) => {
  try {
    const db_category_array = await categoryModel.find();
    console.log(db_category_array);
    res.render('SubCategory_Add', { category_array: db_category_array });
  } catch (err) {
    console.log("Error");
    next(err);
  }
});

router.post('/subcate_process', async (req, res, next) => {
  console.log(req.body);
  const subcategorydata = {
    subcate_id: req.body.subcate_id,
    subcate_name: req.body.subcate_name,
    _category: req.body._category
  }
  console.log(subcategorydata);
  var subcatedata = categoryModel(subcategorydata);
  try {
    await subcatedata.save();
    console.log("Data Saved");
    res.redirect('/subcategory/add_subcategory');
  } catch (err) {
    console.log("Error In Subcategory");
    next(err);
  }
});

router.get('/data_display', async (req, res, next) => {
  try {
    const db_subcategory_array = await subcategoryModel.find().populate('_category');
    console.log(db_subcategory_array);
    res.render('SubCategory_display', { subcategory_array: db_subcategory_array });
  } catch (err) {
    console.log("Error");
    next(err);
  }
});

router.get('/delete/:id', async (req, res, next) => {
  try {
    await subcategoryModel.findByIdAndDelete(req.params.id);
    console.log("-------------------------");
    res.redirect('/subcategory/data_display');
  } catch (err) {
    console.log("Error");
    next(err);
  }
});

router.get('/edit/:id', async (req, res, next) => {
  try {
    const db_subcategory_array = await subcategoryModel.findById(req.params.id);
    const db_category_array = await categoryModel.find();
    console.log('--------------------------------------------------');
    console.log(db_subcategory_array);
    console.log(db_category_array);
    res.render('SubCategory_edit', { subcategory_array: db_subcategory_array, category_array: db_category_array });
  } catch (err) {
    console.log("Error in Edit Subcategory");
    next(err);
  }
});

router.post('/edit/:id', async (req, res, next) => {
  console.log("Edit ID is" + req.params.id);
  const subcategory_data = {
    subcate_id: req.body.subcate_id,
    subcate_name: req.body.subcate_name,
    _category: req.body.category,
  }
  try {
    await subcategoryModel.findByIdAndUpdate(req.params.id, subcategory_data);
    console.log("Record Updated");
    res.redirect('/subcategory/data_display');
  } catch (err) {
    console.log("Error in Record Update");
    next(err);
  }
});

router.get('/show/:id', async (req, res, next) => {
  try {
    const db_subcategory_array = await subcategoryModel.findById(req.params.id).populate('_category');
    console.log(db_subcategory_array);
    res.render('SubCategory_singledata', { subcategory_array: db_subcategory_array });
  } catch (err) {
    console.log("Error in single Record Fetch");
    next(err);
  }
});

module.exports = router;

//single-record
