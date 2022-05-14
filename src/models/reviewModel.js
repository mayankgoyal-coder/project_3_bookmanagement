const mongoose= require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    bookId: {type:ObjectId, required:true, ref:"Book"},
    reviewedBy: {type:String , required:true, default :'Guest',trim:true } , //, value: reviewers name
    reviewedAt: {type:Date, required:true},
    rating: {type:Number, range:[1,5], required:true},
    review: {type:String ,trim:true },
    isDeleted: {type:Boolean, default: false},

},{timestamps:true})

module.exports = mongoose.model("Review",reviewSchema)