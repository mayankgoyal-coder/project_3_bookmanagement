const express = require("express");
const router = express.Router();
const {userCreate,userLogin} =require("../controllers/userController")
const {createBook,getBookByQueryParams,getBookById,updateBookById,deleteById} =require ("../controllers/bookController")

router.post("/register", userCreate)
router.post("/login", userLogin)

router.post("/books",createBook)
router.get("/books",getBookByQueryParams)
router.get("/books/:bookId",getBookById)
router.put("/books/:bookId",updateBookById)
router.delete("/books/:bookId",deleteById)

module.exports = router