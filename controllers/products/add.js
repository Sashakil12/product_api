const Product = require("../../Models/Product");

module.exports = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      categoryId: req.body.categoryId,
      categoryName: req.body.categoryName,
      unitPrice: req.body.unitPrice,
      status: req.body.status,
    });
    await product.save()
    res.status(201).send(product);
  } catch (e) {
    console.log(e);
    res.status(500).send({code:e.code||0,message:e.message||"internal server error"});
  }
};
