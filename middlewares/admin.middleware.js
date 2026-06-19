

const jwt = require("jsonwebtoken")

const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN


function adminMiddleware(req,res,next){

    const token = req.headers.token 

    if (!token) {
        return res.json({
            message: "token is required..."
        })
    }

    try {
        
        const decodedInformation = jwt.verify(token,JWT_SECRET_ADMIN)

        req.adminId = decodedInformation.adminId
        next()

    } catch (error) {
        return res.json({
            message: "invalid token !"
        })
    }

}


module.exports = adminMiddleware