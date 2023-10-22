var mongoose= require('mongoose');
var Schema=mongoose.Schema;
var Payments  = new Schema({
    Payment_id      : String,
    Order_id        : String,
    Order: { type: Schema.Types.ObjectId, ref: 'Order' },
    Receipt_id      : String,
    Payment_date    : Date,
    Payment_staus   :Boolean,
    Payment_type    :String  
});
module.exports=mongoose.model('Payment',Payments);