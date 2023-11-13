var mongoose= require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var schema=mongoose.Schema;
var Productdetails  = new schema({
    Product_id     : String,
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
        ref: 'Customer',
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
    },
    Rater:{
        type: Number,
        default: 0
    }
});
Productdetails.plugin(mongoosePaginate);
module.exports=mongoose.model('Product',Productdetails);