var mongoose= require('mongoose');
var schema=mongoose.Schema;
var RatingSchema = new schema({
    Product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: false
    },
    date:{
        type: Date
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    name: String,
});
module.exports=mongoose.model('Rating',RatingSchema);