require("dotenv").config({
  path: "../.test.env",
});
const { addProductUser } = require("./fixtures/userData");
const request = require("supertest");
const { app } = require("../index");
const mongoose = require("mongoose");
const Product = require("../Models/Product");
const User = require("../Models/User");
const productData = require("./fixtures/singleProductData");

let token;
let userId;
let product;
beforeAll(async () => {
  //connects to the database
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    //add user
    const response = await request(app)
      .post("/user/register")
      .send(addProductUser);

    token = response.body.token;
    userId = response.body._id;
    //add a product
    const productResponse = await request(app)
      .post("/product/add")
      .set("Authorization", "Bearer " + token)
      .send(productData);

    product = productResponse.body;

    return mongoose.connection.db
      .collection("products")
      .createIndex({ name: 1 }, { unique: true });
  } catch (e) {
    console.log(e);
    throw e;
  }
}, 30000);

describe("deleting product", () => {
  test("it rejects a delete call with an invalid product id", async () => {
    const response = await request(app)
      .delete("/product/not-a-mongodb-objectId")
      .set("Authorization", "Bearer " + token)
      .expect(422);
  });
  test("it deletes a product with a valid productId", async () => {
    const productsCount = await Product.find({}).countDocuments();

    const response = await request(app)
      .delete("/product/" + product._id)
      .set("Authorization", "Bearer " + token)
      .expect(200);
    const productsCountAfter = await Product.find({}).countDocuments();
    expect(productsCountAfter).toBeLessThan(productsCount);
    expect(productsCountAfter).toEqual(productsCount - 1);
  });
});

afterAll(async () => {
  await User.deleteOne({ _id: userId });
  await Product.deleteMany({});
});
