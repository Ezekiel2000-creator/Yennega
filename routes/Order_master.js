var express = require('express');
var router = express.Router();
var Orders= require('../Schema/Order_master_table');
var Customer= require('../Schema/Customer_table');
var Cart = require('../Schema/Cart')


//display data
router.get('/list', async (req, res) => {

    try {
  
      // Populer l'utilisateur pour chaque commande
      const orders = await Orders.find({})
      .sort({date: -1})
      .populate("user");
      console.log("orderssssssssssss",orders)
  
      res.render('order_display', {
        orders 
      });
  
    } catch (err) {
      console.error(err);
    }
  
  });

//delete data
router.get('/delete/:id',function(req,res){
    Orders.findByIdAndDelete(req.params.id,function(err,db_inquery_array){
        if(err)
        console.log("Error in delete data");
        else
        {
            console.log(db_inquery_array);
            res.redirect('/orders/list');
        }
    });
});
//delete data
router.get('/edit/:id',function(req,res,next){
    Cart.findById(req.params.id,function(err,db_inquery_array){
        if(err)
        console.log("Error");
        else
        {
            console.log("before edit display : ",db_inquery_array);
            res.render('Order_edit',{inquery_array:db_inquery_array});
        }
    });
});
router.post('/edit/:id',function(req,res){
    console.log("Edit ID is"+req.params.id);
    const inquery_data={
        inq_id          : req.body.inq_id,
        customer_id     : req.body.customer_id,
        inq_date        : new Date(Date.now()).toLocaleString(), 
        inq_question : req.body.inq_question,
        inq_answer : req.body.inq_answer
    }
    inqueryModel.findByIdAndUpdate(req.params.id,inquery_data,function(err){
            if(err)
            {
            console.log(req.params.id);
                console.log("Error in Record Update");
            }
        else
            res.redirect('/inquery/data_display');
        });
    });    
//edit data


module.exports = router;    