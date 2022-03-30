const Product = require("../../Models/Product");

module.exports = async (req, res) => {
  try {
    const data={}
    if(req.body.name){
      data.name=req.body.name
    }
    if(req.body.categoryId){
      data.categoryId=req.body.categoryId
    }
    if(req.body.categoryName){
      data.categoryName=req.body.categoryName
    }
    if(req.body.unitPrice){
      data.unitPrice=req.body.unitPrice
    }
    if(req.body.status){
      data.status = req.body.status
    }
    const product = await Product.findByIdAndUpdate(req.params.id,{
      ...data
    },{new:true});
    res.status(200).send(product);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
