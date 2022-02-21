// import des module necessaire

const jwt = require('jsonwebtoken')

//extraction du token

const extractBearer = authorization => {
    if (typeof authorization !== 'string') {
        return false
    }
    // on isole le token
    const matches = authorization.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}


//verification de la presence du token

const checkTokenMiddleware = (req, res, next) => {

    const token = req.headers.authorization && extractBearer(req.headers.authorization)

    if (!token) {
        return res.status(401).json({ message: 'Ho le petit malin' })
    }

    // Verifier la validité du token

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: 'bad token' })
        }
        next()
    })
}

module.exports = checkTokenMiddleware