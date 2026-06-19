
const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({

    title:{
        type: String,
        trim: true,
        required: true
    },
     description:{
        type: String,
        trim: true,
        required: true
    },
     Price:{
        type: Number,
        trim: true,
        required: true
    },
     img_url:{
        type: String,
        trim: true,
        required: true
    },
    creatorId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin"
    }

},{timestamps: true})


const courseModel = mongoose.model("courses",courseSchema)

module.exports = courseModel