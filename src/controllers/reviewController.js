const reviewModel = require("../models/reviewModel")
const bookModel = require ("../models/bookModel")
const userModel = require("../models/userModel")
const mongoose = require ("mongoose")

const isValidObjectId = function (Id) {
    return mongoose.isValidObjectId(Id)          //mongoose.Types.ObjectId.isValid(Id)
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length != 0
}

const createReview = async function(req,res){
    try{
        const bookId = req.params.bookId
        const requestBody = req.body
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "bookId is not valid" })
        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, message: "Invalid request parmeters,Please provide review details" })

        const bookReview = await bookModel.findOne({_id:bookId,isDeleted:false})
        if(!bookReview) return res.status(404).send({Status:false, message:"Book Not Found"})

        const createdReview = await bookModel.create(requestBody)
        return res.status(201).send({ status: true, message: "created successfully", data: createdReview })


        
    }catch(err){
        res.status(500).send({status:false,Error:err.message})
    }
}
const updateReview = async function(req,res){
//mayank
try{
    const bookId = req.params.bookId
    const reviewId = req.params.reviewId
    const requestedBody= req.body
    const {reviewdBy,review,rating}=requestedBody
   
    const bookIdExist = await bookModel.findById({_id:bookId,isDeleted:false})
    if(!bookIdExist)return res.status(404).send({status:false,message:"bookId neighther exist nor deleted"})
   
    const reviewIdexist= await reviewModel.findById({_id:reviewId,isDeleted:false})
    if(!reviewIdexist)return res.status(404).send({status:false,message:"reviewId neither exist nor deleted"})

    const updatedReview = await reviewModel.findOneAndUpdate({_id:reviewId},{reviewdBy:reviewdBy,review:review,rating:rating},{new:true})
    res.status(200).send({ status: true, message: "review update successfully", data: updatedReview })


}catch(err){
    return res .status(500).send({status:false, Error:err.message})

}
}

const deleteReview = async function(req,res){
//nithish
// try{
//     const bookId = req. params.bookId
//     const reviewId = req.params.reviewId
    
// }
}

module.exports={ createReview,updateReview ,deleteReview}