require("dotenv").config({
  path: "../.test.env",
});
const { addProductUser } = require("./fixtures/userData");
const request = require("supertest");
const { app } = require("../index");
const mongoose = require("mongoose");
const Product = require("../Models/Product");
const User = require("../Models/User");
const productData = require("./fixtures/productsSeedData");

let token;
let userId;
let productIds;
let products;
beforeAll(async () => {
  //connects to the database
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    //register user
    const response = await request(app)
      .post("/user/register")
      .send(addProductUser);

    token = response.body.token;
    userId = response.body._id;
    //add some products
    products = await Product.insertMany(productData);

    productIds = products.map((product) => product._id);

    return mongoose.connection.db
      .collection("products")
      .createIndex({ name: 1 }, { unique: true });
  } catch (e) {
    console.log(e);
    throw e;
  }
}, 30000);

describe("deleting multiple product", () => {
  test("it rejects a delete call with an empty 'ids' array at body", async () => {
    const response = await request(app)
      .delete("/product/multiple")
      .set("Authorization", "Bearer " + token)
      .send({ ids: [] })
      .expect(422);
  });
  test("it rejects a delete call with invalid product ids productId", async () => {
    const response = await request(app)
      .delete("/product/multiple")
      .set("Authorization", "Bearer " + token)
      .send({ ids: ["addfr", "sdderr", "six"] })
      .expect(422);
  });
  test("it deletes multiple products from given productIds", async () => {
    const productsCount = await Product.find({}).countDocuments();
    const response = await request(app)
      .delete("/product/multiple")
      .set("Authorization", "Bearer " + token)
      .send({ ids: productIds })
      .expect(200);
    const productsCountAfter = await Product.find({}).countDocuments();
    expect(productsCountAfter).toBeLessThan(productsCount);
    expect(productsCountAfter).toEqual(productsCount - productIds.length);
    expect(response.body.deletedCount).toEqual(productIds.length);
  });
});

afterAll(async () => {
    await User.deleteOne({ _id: userId });
    await Product.deleteMany({});
  });
  
