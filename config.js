
const mongoose = require("mongoose")

async function  ConnectionDB(url) {
    
    try {
        await mongoose.connect(url)
        console.log("mongoDB Connected successfully...");
        
    } catch (error) {
      console.log("mongoDb connection error :", error);
      
    }

}

module.exports = ConnectionDB