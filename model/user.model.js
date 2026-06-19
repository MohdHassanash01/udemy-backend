
const mongoose = require("mongoose")
const { string } = require("zod")

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },

    username: {
        type: String,
        required: true,
        trim : true
    },

    password: {
        type: String,
        trim: true,
        required: true
    }

})


const userModel = mongoose.model("user",userSchema)

module.exports = userModel