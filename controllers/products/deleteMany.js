const Product = require("../../Models/Product");

module.exports = async (req, res) => {
  try {
    const products = await Product.deleteMany({ _id: req.body.ids });
    console.log(products)
    res.status(200).send(products);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
