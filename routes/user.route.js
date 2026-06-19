require("dotenv").config() 

const express = require("express")
const {z}  = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../model/user.model")
const userMiddleware = require("../middlewares/user")
const { signupSchema, signinSchema } = require("../zod-schemas")
const purchaseModel = require("../model/purchases.model")
const userRouter = express.Router()


const JWT_SECRET_USER = process.env.JWT_SECRET_USER




userRouter.post("/signup",async function(req,res){

    const parsedDataWithSuccess = signupSchema.safeParse(req.body)

    if (!parsedDataWithSuccess.success) {
        return res.send({
            error: "Incorrect format",
            message: parsedDataWithSuccess.error.issues[0].message
                })
    }

    const {email, username, password} = parsedDataWithSuccess.data

    try {

        const existsUser = await userModel.findOne({email})

        if (existsUser) {
            return res.json({
                message: "user already exists..."
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            email,
            username,
            password: hashedPassword
        })

        if (user) {
            return res.json({
                success: true,
                message: "you are signin...",
                username: user.username,
                email: user.email
            })
        }
        

    } catch (error) {
        return res.json({
            message: "Internal server error",
            error: error.message
        })
    }


})



userRouter.post("/signin",async function(req,res){

const parsedDataWithSuccess = signinSchema.safeParse(req.body)

if (!parsedDataWithSuccess.success) {
    return res.json({
        error: "Incorrect format",
        message: parsedDataWithSuccess.error.issues[0].message
    })
}

const {email, password} = parsedDataWithSuccess.data

    try {

        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({ message: "User not found" })
        }

        const matchPassword = await bcrypt.compare(password,user.password)

        if (matchPassword) {

            const token = jwt.sign({userId: user._id},JWT_SECRET_USER)

            return res.json({
                message: "you are signin...",
                token
            })
        }else{

            return res.send({
                message: "Incorrect password"
            })

        }
        
    } catch (error) {
        return res.json({
            message: "Internal server error",
            error: error.message
        })
    }


})



userRouter.get("/me",userMiddleware,async function(req,res){

   try {
    
     const user = await userModel.findById(req.userId)

    if (user) {
        return res.json({
            username: user.username,
            email : user.email
        })
    }else{

        return res.json({
            message: "user not exists"
        })

    }

   } catch (error) {

        return res.json({
            message: "Internal server error"
        })
   }

})





userRouter.get("/purchases",userMiddleware,async function(req,res){

    try {

        const alreadyPurchased = await purchaseModel.findOne({ courseId, userId })

if (alreadyPurchased) {
    return res.status(400).json({ message: "Course already purchased" })
}

        const purchases = await purchaseModel.find({
           userId: req.userId 
        })

        if (purchases.length > 0) {
            return res.json({
                message: "All purchase courses",
                purchases
            })
        }else{

            return res.json({
                message:"No courses found"
            })

        }

        
    } catch (error) {

        return res.json({
            message: "Internal server error",
            error: error.message
        })
    }

})


module.exports = userRouter