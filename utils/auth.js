const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const User = require('../Models/User')

async function auth(req, res, next){
    try{
        
        if(!req.header('Authorization')){
            return res.status(401).send({error:'Unauthorized'})
        }
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById({_id:decoded._id, 'tokens':token});

        if (!user) {
            throw new Error("couldn\'t log you in");
        }

        req.token = token;
        req.user = user;
        next()
    }catch(e){
        console.log(e)
        res.status(401).send()
    }
}

module.exports = auth