const jwt = require("jsonwebtoken")

const JWT_SECRET_USER = process.env.JWT_SECRET_USER


function userMiddleware(req,res,next){

    const token = req.headers.token 

    if (!token) {
        return res.json({
            message: "token is required..."
        })
    }

    try {
        
        const decodedInformation = jwt.verify(token,JWT_SECRET_USER)

        req.userId = decodedInformation.userId
        next()

    } catch (error) {
        return res.json({
            message: "invalid token !"
        })
    }

}


module.exports = userMiddleware