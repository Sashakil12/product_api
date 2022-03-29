const Mongoose = require("mongoose");

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
    type: String,
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
            const authorized = await bcrypt.compare(password, user.password);
            if (!authorized) {
                throw new Error('Invalid password')
            }
            return user
      

}
UserSchema.methods.getToken = async function(){    
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: '10d'})
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
}
//Hashing the password before saving if changed
UserSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8) 
    }
    
    next()
})

module.exports = Mongoose.model("User", UserSchema);
