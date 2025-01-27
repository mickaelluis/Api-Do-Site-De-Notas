require('dotenv').config();
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_TOKEN

const User = require('../models/users')

const WithAuth = (req, res, next) => {
    const token = req.headers ['x-access-token'];
    if(!token)
        res.status(401).json({error: 'Unauthorized: no token provided'})
    else {
        jwt.verify(token, secret, (err, decode) => {
            if(err)
            res.status(401).json({error: 'Unauthorized: no token invalid'})
            else {
                req.email = decode.email
                User.findOne({ email: decode.email})
                .then( user => {
                    req.user = user;
                    next();
                }).catch(err => {
                    res.status(401).json({error: err})
                })
            }
        } )
    }
}

module.exports = WithAuth;