const Product = require("../../Models/Product");

module.exports = async (req, res) => {
  try {
    const products = new Product({
      name: req.body.name,
      categoryId: req.body.categoryId,
      categoryName: req.body.categoryName,
      unitPrice: req.body.unitPrice,
      status: req.body.status,
    });
    res.status(201).send(products);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
