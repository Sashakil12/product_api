const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const ProductSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique:true
    },
  
    categoryId: {
      type: String, trim:true, required:true, minlength: 8,
    },
    categoryName:{type:String},
    unitPrice:{type:Number, required:true},
    status:{type:String, required:true,enum:['available','discontinued']},
  },{ timestamps: true });
  

const Product = mongoose.model("Product", ProductSchema)

module.exports = Product;