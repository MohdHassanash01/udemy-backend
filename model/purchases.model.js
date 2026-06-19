

const mongoose = require("mongoose")
const { string } = require("zod")

const purchaseSchema = new mongoose.Schema({

 

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"courses",
        required: true,
    },

    userId: {
         type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true,
    }

})


const purchaseModel = mongoose.model("purchases",purchaseSchema)

module.exports = purchaseModel