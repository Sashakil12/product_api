const Product = require("../../Models/Product");

module.exports = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id,{
      name: req.body.name,
      categoryId: req.body.categoryId,
      categoryName: req.body.categoryName,
      unitPrice: req.body.unitPrice,
      status: req.body.status,
    });
    res.status(200).send(product);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
