require('dotenv').config({path:process.env.NODE_ENV==='development'?'./.dev.env':'./.prod.env'})
const Mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const { Schema } = Mongoose;
const jwt = require("jsonwebtoken")

// User Schema
const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique:true
  },

  password: {
    type: String, trim:true, required:true, minlength: 8,
  },
  tokens:[{type:String}],
  token:{type:String}
});

UserSchema.methods.toJSON = function(){
    const user = this.toObject()
    delete user.password;
    delete user.tokens;
    return user
}

UserSchema.statics.verifyCredentials = async (userName, password)=>{       
            const user = await User.findOne({ userName });

            if (!user) {
                throw new Error("No user")
            }
            console.log(user)
            const authorized = await bcrypt.compare(password, user.password);
            if (!authorized) {
                throw new Error('Invalid password')
            }
            return user
      

}
UserSchema.methods.getToken = async function(){    
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: '10d'})
    this.tokens = this.tokens.concat(token)
    await this.save()
    return token
}
UserSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8) 
    }
    
    next()
})
const User =  Mongoose.model("User", UserSchema);

module.exports =User
