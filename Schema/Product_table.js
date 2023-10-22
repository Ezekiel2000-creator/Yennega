var mongoose= require('mongoose');
var schema=mongoose.Schema;
var Productdetails  = new schema({
    Product_id     : String,
    Customer_id    : String,
    Cate_id        : String,
    Pro_name       : String,
    Pro_image      : String,
    Pro_quantity   : Number,
    Pro_description: String,  
    Pro_subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory'
    }, 
    Pro_date       : String,
    Pro_vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
      },
    Pro_rentprice  : Number,   
    Pro_ammount    : Number,
    Ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
    }],
    Rate:{
        type: Number,
        default: 0
    }
});
module.exports=mongoose.model('Product',Productdetails);