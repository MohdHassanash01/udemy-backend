
const express = require("express")
const courseModel = require("../model/course.model")
const {courseSchema} = require("../zod-schemas")
const adminMiddleware = require("../middlewares/admin.middleware")
const userMiddleware = require("../middlewares/user")
const purchaseModel = require("../model/purchases.model")
const CourseRouter = express.Router()



CourseRouter.post("/create-course",adminMiddleware,async function(req,res){

    const parsedDataWithSuccess = courseSchema.safeParse(req.body)

    if (!parsedDataWithSuccess.success) {
        return res.json({
            error: "incorrect format",
            message: parsedDataWithSuccess.error.issues[0].message
        })
    }

    const {title,description, Price, img_url} = parsedDataWithSuccess.data

    try {
        
const course = await courseModel.create({
    title,description, Price, img_url,
    creatorId: req.adminId
})

if (course) {
    return res.json({
        success: true,
        message: "Course created successfully",
        course
    })
}else{

     return res.json({
        message: "course is not created"
    })
}


    } catch (error) {
        return res.json({
            message: "Internal server error"
        })
    }


})




CourseRouter.get("/all-courses",adminMiddleware,async function(req,res){


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


CourseRouter.get("/course/:id",adminMiddleware,async function(req,res){

    const id = req.params.id

    try {
        
const course = await courseModel.findOne({
    _id: id,
    creatorId: req.adminId
})

if (course) {
    return res.json({
        success: true,
        message: "Course fetch successfully",
        course
    })

}else{

     return res.json({
        message: "course not created yet"
    })
}


    } catch (error) {
        return res.json({
            message: "Internal server error"
        })
    }


})



CourseRouter.put("/update-course/:id",adminMiddleware,async function(req,res){

    const id = req.params.id

    const parsedDataWithSuccess = courseSchema.safeParse(req.body)

    if (!parsedDataWithSuccess.success) {
        return res.json({
            error: "incorrect format",
            message: parsedDataWithSuccess.error.issues[0].message
        })
    }

    const {title,description, Price, img_url} = parsedDataWithSuccess.data

    try {
        
const course = await courseModel.findOneAndUpdate({
    _id: id,
    creatorId:  req.adminId
},{
    title,description, Price, img_url,
    creatorId: req.adminId
},{new : true})

if (course) {
    return res.json({
        success: true,
        message: "Course updated successfully",
        course
    })
}else{

     return res.json({
        message: "course is not updated"
    })
}


    } catch (error) {
        return res.json({
            message: "Internal server error"
        })
    }


})


CourseRouter.delete("/:id",adminMiddleware,async function(req,res){

    const id = req.params.id

    try {
        
const course = await courseModel.findOneAndDelete({
    _id: id,
    creatorId: req.adminId
})

if (course) {
    return res.json({
        success: true,
        message: "Course delete successfully",
        course
    })

}else{

     return res.json({
        message: "course not deleted yet"
    })
}


    } catch (error) {
        return res.json({
            message: "Internal server error"
        })
    }


})


// preview all courses

CourseRouter.get("/preview",async function(req,res){

 try {
    
       const courses = await courseModel.find()
    
    if (courses.length > 0) {
        return res.json({
            message: "ALl course here",
            courses
        })
    }else{
        return res.json({
            message: "courses not exists yet"
        })
    }

 } catch (error) {
    return res.json({
        message: "Internal server error",
        error: error.message
    })
 }

})


// user want to buy a course

CourseRouter.post("/purchase/:id",userMiddleware,async function(req,res){

    const courseId = req.params.id
    const userId =   req.userId

  try {
    
      const purchaseCourse = await purchaseModel.create({
        courseId,
        userId
    })

    if (purchaseCourse) {
        return res.json({
            success: true,
            message: "course successfully purchase...",
            course: purchaseCourse
        })
    }else{

         return res.json({
            message: "course is not purchase...",
        })

    }

  } catch (error) {
    
    return res.json({
        message: "Internal server error",
        error: error.message
    })

  }



})


module.exports = CourseRouter