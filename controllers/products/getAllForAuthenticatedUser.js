const Product = require("../../Models/Product");

module.exports = async (req, res) => {
  try {
    const products = await Product.find({})
      .skip(req.query.skip)
      .limit(req.query.limit);
    res.send(products);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
