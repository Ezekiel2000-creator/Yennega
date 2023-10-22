var express = require('express');
var router = express.Router();
var AdminLoginModel=require('../Schema/Admin_table');
var CustomerModel=require('../Schema/Customer_table');
var CategoryModel=require('../Schema/Category_table');
/* GET home page. */ 
router.get('/', async (req, res, next) => {

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

router.get('/dashboard', function(req, res, next) {
  CustomerModel.find(function(err,db_customer_array){

  CategoryModel.find(function(err,db_category_table){
    if(err){
      console.log("error");
    }else{
        res.render('dashboard',{customer_array:db_customer_array,category_array:db_category_table});
      }
    });
  });
});
module.exports = router;