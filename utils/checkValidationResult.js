const {validationResult} = require('express-validator');
module.exports = (req, res, next)=>{
    if(process.env.NODE_ENV==='development'){
        console.log("body",req.body)
        console.log("query",req.query)
    }
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors)
        return res.status(422).json({
            errors: errors.array()
        })
    }
    next()
}