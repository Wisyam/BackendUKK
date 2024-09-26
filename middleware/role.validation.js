exports.isUser = async(req, res, next) => { // ini adalah role kasir
    console.log(req.user.role)
    if(req.user.role == "kasir"){
        next()
    }
    else {
        return res.status(401).json({
            success: false,
            auth: false,
            message: "Forbidden! You are not Kasir"
        })
    }
}
exports.isUser = async(req, res, next) => { // ini adalah role manager
    console.log(req.user.role)
    if(req.user.role == "manager"){
        next()
    }
    else {
        return res.status(401).json({
            success: false,
            auth: false,
            message: "Forbidden! You are not Kasir"
        })
    }
}
exports.isAdmin = async(req, res, next) => { // ini adalah role admin
    console.log(req.user.role)
    if(req.user.role == "admin"){
        next()
    }
    else {
        return res.status(401).json({
            success: false,
            auth: false,
            message: "Forbidden! You are not Admin"
        })
    }
}