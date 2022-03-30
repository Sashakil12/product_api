const Product = require("../../Models/Product");

module.exports = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id });
    res.status(200).send(product);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
