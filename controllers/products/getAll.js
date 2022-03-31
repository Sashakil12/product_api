const Product = require("../../Models/Product")


module.exports=async (req,res)=>{
    try{
        const products = await Product.find({status:"available"}).select("name categoryId categoryName unitPrice")
        res.send(products)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}