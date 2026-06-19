require("dotenv").config()

const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const adminRouter = express.Router()

const adminModel = require("../model/admin.model")
const { z } = require("zod")
const adminMiddleware = require("../middlewares/admin.middleware")
const { signupSchema, signinSchema } = require("../zod-schemas")
const courseModel = require("../model/course.model")

const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN





adminRouter.post("/signup",async function(req,res){

    const parsedDataWithSuccess  = signupSchema.safeParse(req.body)

    if (!parsedDataWithSuccess.success) {

        return res.json({
            error: "Incorrect format",
            message: parsedDataWithSuccess.error.issues[0].message
        })
    }

    const {username, email, password} = parsedDataWithSuccess.data

    try {

        const existsAdmin = await adminModel.findOne({email})

        if (existsAdmin) {
            return res.json({
                message : "admin already exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const admin = await adminModel.create({
            username, email,
            password: hashedPassword
        })

        if (admin) {
            return res.json({
                success: true,
                message : "you are signup...",
                username: admin.username,
                email : admin.email
            })
        }

        
    } catch (error) {
        
        return res.json({
            message: "Internal server error",
            error: error.message
        })

    }


})


adminRouter.post("/signin",async function(req,res){

    const parsedDataWithSuccess  = signinSchema.safeParse(req.body)

    if (!parsedDataWithSuccess.success) {

        return res.json({
            error: "Incorrect format",
            message: parsedDataWithSuccess.error.issues[0].message
        })
    }

    const { email, password} = parsedDataWithSuccess.data

    try {

        const admin = await adminModel.findOne({email})

        if (!admin) {
            return res.json({
                message : "admin is not exist"
            })
        }

        const matchPassword = await bcrypt.compare(password,admin.password )


        if (matchPassword) {

            const token = jwt.sign({adminId: admin._id},JWT_SECRET_ADMIN)

            return res.json({
                success: true,
                message : "you are signin...",
                token
            })
        }else{

            return res.json({
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


adminRouter.get("/me",adminMiddleware,async function(req,res){

    try {
        
        const admin = await adminModel.findById(req.adminId)

        if (admin) {
            return res.json({
                username: admin.username,
                email: admin.email
            })
        }else{
             return res.json({
                message: "admin is not exists"
            })
        }

    } catch (error) {
        return res.json({
            message : "internal server error"
        })
    }

})


adminRouter.get("/course/bilk",adminMiddleware,async function(req,res){


    try {
        
const courses = await courseModel.find({
    creatorId: req.adminId
})

if (courses.length > 0) {
    return res.json({
        success: true,
        message: "Course fetch successfully",
        courses
    })

}else{

     return res.json({
        message: "courses not created yet"
    })
}


    } catch (error) {
        return res.json({
            message: "Internal server error"
        })
    }


})


module.exports = adminRouter