var mongoose= require('mongoose');
var schema=mongoose.Schema;
var customer_data  = new schema({

    Customer_id              :     String,
    Customer_name            :     String,
    Customer_first_name      :     { type: String, required: true },
    Customer_last_name       :     { type: String, required: true },
    Customer_contact_no      :     Number,
    Customer_email           :     String,
    Customer_address         :     String,
    Customer_dob             :     Date,
    Customer_gender          :     String,
    Customer_password        :     String,
    verify                   :     { type: Boolean, default: false }, // Champ verify de type booléen avec une valeur par défaut de false
    isVendor                 :     { type: Boolean, default: false },
    isAdmin                  :     { type: Boolean, default: false },
    code                     :     { type: String},
});
module.exports=mongoose.model('Customer',customer_data);