const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const userRouter = require("./routes/user.route")

const ConnectionDB = require("./config")
const adminRouter = require("./routes/admin.route")
const CourseRouter = require("./routes/course.route")
dotenv.config()

const app = express()

const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors())

app.use("/api/v1/user",userRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/course",CourseRouter)


app.listen(PORT,function(){
    ConnectionDB("mongodb+srv://mohdashrafhassan098_db_user:VZQkt2oBov57DjYq@cluster0.djdbfdf.mongodb.net/coursera-prac")

    console.log(`server is running on PORT : ${PORT}`);
    
})