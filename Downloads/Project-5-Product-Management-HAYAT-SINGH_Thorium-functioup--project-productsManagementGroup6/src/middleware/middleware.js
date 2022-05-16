const jwt = require('jsonwebtoken')

const authentication = async function (req, res, next) {
    try {
        const token = req.headers.authorization;
        if (token) {
            bearertoken = token.split(" ")
            const decoded = jwt.verify(bearertoken[1], 'privatekey')
            if (decoded) {
                req.decodedToken = decoded
            }
            else {
                return res.status(401).send({ status: false, msg: "invalid authentication token" })
            }
        }else{
            return res.status(403).send({ status: false, message: `Missing authentication token in request` })
        }
        next()
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}



module.exports.authentication = authentication