var express = require('express')
var router = express.Router();
const User =  require('../models/users')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const secret = process.env.JWT_TOKEN

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body; 
    const user = new User({ name, email, password });
    try {
      await user.save();
      const token = jwt.sign({email},  secret, {expiresIn: '1d'});
      res.status(200).json({ token });
    } catch (error) {  
      res.status(500).json({ error: 'Error registering new user' });
    }
  });

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if(!user)
            res.status(401).json({error: 'incorrect email or password'});
        else {
            user.isCorrectPassword(password, function ( err, same){
                if(!same) 
                    res.status(401).json({error:'incorrect email or password'});
                else {
                    const token = jwt.sign({email},  secret, {expiresIn: '1d'})
                    res.json({ token: token, name: user.name });
                }
            })
        }
    } catch (error) {
        res.status(500).json({error: 'internal error, please try again'})
    }
})

module.exports = router