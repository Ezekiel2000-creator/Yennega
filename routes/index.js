var express = require('express');
var router = express.Router();
const moment = require('moment');
var AdminLoginModel=require('../Schema/Admin_table');
var CustomerModel=require('../Schema/Customer_table');
var CategoryModel=require('../Schema/Category_table');
var OrderModel=require("../Schema/Order_master_table");
var VendorRequest =require("../Schema/Vendor_request");
/* GET home page. */ 


const requireVendor = async (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    req.session.returnTo = req.originalUrl;
    return res.status(401).redirect("/signin");
  }
  
  try {
    const decodedToken = jwt.verify(token, 'your_secret_key');
    req.user = decodedToken;
    
    const user = await mongoose.model('Customer').findOne({ _id: req.user.id });
    if (!user.isVendor) {
      return res.status(403).json({ message: 'Forbidden: User is not a vendor' });
    }
    
    const products = await mongoose.model('Product').find({ Pro_vendor: user._id });
    req.user.products = products;
    
    const userCart = await Cart.findOne({ user: req.user.id }).populate('items');
    if (userCart === null || userCart.items === 0) {
      const carts = [];
      app.locals.carts = carts;
    }
    
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).redirect("/signin");
    } else {
      return res.status(401).json({ message: 'Token invalide' });
    }
  }
};

// router.use(requireVendor);
router.get('/admin',requireVendor, async (req, res, next) => {

  let admins;

  try {
    admins = await AdminLoginModel.find();
  } catch (err) {
    console.error(err);
  }

  if(!admins.length) {
    // No documents found, create a default one

    const admin = new AdminLoginModel({
      Admin_id: '', 
      Admin_name: 'Ezekiel',
      Admin_contact_no: 96353598,
      Admin_email: 'kirouni76@gmail.com',
      Admin_password: 'Jesuisle1@cerco',
    });

    try {
      await admin.save();
      admins = [admin];
    } catch (err) {
      console.error(err);
      return res.sendStatus(500); 
    }

  }

  res.render('Admin_login', { admins });

});
router.get('/', async (req, res, next) => {
  res.redirect("/accueil")
}); 
router.post('/login_process',function(req,res,next){
  
  AdminLoginModel.find(function(err,db_admin_array){
    if(err){
        console.log(err);
    }
    else{
      
              var flag=true;  //temp variable
              var admin_id=req.body.Admin_id;
              var admin_email=req.body.Admin_email;
              var admin_password = req.body.Admin_password;
              
              req.session.Admin_email = admin_email;
              req.session.Admin_password=admin_password;
              
              console.log("Email"+req.session.Admin_email);
              console.log("Password"+req.session.Admin_password);
            
              if(db_admin_array.length>0)
              {
                for(var i=0;i<db_admin_array.length;i++)
                {
                    if( req.session.Admin_email  ==  db_admin_array[i].Admin_email && 
                        req.session.Admin_password  ==  db_admin_array[i].Admin_password)
                      {
                        flag=true;
                        console.log("Session Connected Successfully");
                        res.redirect('/admin/data_display');
                        break;
                      }
                      else{
                        flag=false;  
                      } 
                }
                if(!flag)
                {
                    res.redirect('/');
                }  
              }
            else
            {
              res.redirect('/'); 
            }
        }
  });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  
  res.redirect('/');
});

router.get('/forgotpassword', function(req, res, next) {
  res.render('forgot_password');
});

router.get('/dashboard', async (req, res, next) => {
  try {
    const customer_id = req.user.id
    const db_customer_array = await CustomerModel.findById(customer_id);

    const db_category_table = await CategoryModel.find();

    const db_order_table = await OrderModel.find()
    .sort({_id:-1})
    .populate("user");
    
    const db_vendorRequest_table = await VendorRequest.find()
    .sort({_id:-1})
    .populate("user");
    

    res.render('dashboard', {
      moment,
      customer_array: db_customer_array,
      category_array: db_category_table,
      order_array   : db_order_table,
      vendorRequest_array : db_vendorRequest_table,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Erreur interne du serveur"); 
  }
});
module.exports = router;