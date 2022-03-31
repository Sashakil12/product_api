require('dotenv').config({path:__dirname+"/../.test.env"})

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

describe("testing request body for update product call", () => {
  test("it converts a non-string 'name' in to string body", async () => {
    const { name, ...rest } = productData;
    const invalidName = Math.round(Math.random() * 1000);
    const response = await request(app)
      .patch("/product/" + product._id)
      .set("Authorization", "Bearer " + token)
      .send({ name: invalidName, ...rest })
      .expect(200);
    expect(response.body.name).toBe(String(invalidName));
  });
  test("it rejects a request with a non numeric 'categoryId' in body", async () => {
    const { categoryId, ...rest } = productData;
    const response = await request(app)
      .patch("/product/" + product._id)
      .set("Authorization", "Bearer " + token)
      .send({
        categoryId: "aaa",
        ...rest,
        name: rest.name + Math.round(Math.random() * 1000),
      })
      .expect(422);
  });
  test("it converts a non string 'categoryName' to string in body", async () => {
    const { categoryName, ...rest } = productData;
    const invalidCategoryName = 1245;
    const response = await request(app)
      .patch("/product/" + product._id)
      .set("Authorization", "Bearer " + token)
      .send({
        categoryName: invalidCategoryName,
        ...rest,
        name: rest.name + Math.round(Math.random() * 1000),
      })
      .expect(200);
    expect(response.body.categoryName).toBe(String(invalidCategoryName));
  });

  test("it converts a non numeric 'unitPrice' to float in body", async () => {
    const { unitPrice, ...rest } = productData;
    const invalidUnitPrice = "14.25";
    const response = await request(app)
      .patch("/product/" + product._id)
      .set("Authorization", "Bearer " + token)
      .send({
        unitPrice: invalidUnitPrice,
        ...rest,
        name: rest.name + Math.round(Math.random() * 1000),
      })
      .expect(200);
    expect(response.body.unitPrice).toBe(Number(invalidUnitPrice));
  });
  test("it rejects a 'status' value that is not allowed as an enum ", async () => {
    const { unitPrice, ...rest } = productData;
    const invalidStatus = "bnvcc";
    const response = await request(app)
      .patch("/product/" + product._id)
      .set("Authorization", "Bearer " + token)
      .send({
        status: invalidStatus,
        ...rest,
        name: rest.name + Math.round(Math.random() * 1000),
      })
      .expect(422);
  });
});

describe("updating products with valid data", () => {
  test("it successfully updates a product", async () => {
    const updateData = {
      unitPrice: 101.45,
      name: "changed name sigma",
      categoryId: 786,
      categoryName: "changed category name",
      status: "available",
    };
    const response = await request(app)
      .patch("/product/" + product._id)
      .set("Authorization", "Bearer " + token)
      .send(updateData)
      .expect(200);
    const { _id, createdAt, updatedAt, __v, ...responseBody } = response.body;
    expect(responseBody).toEqual(updateData);
  });
});

afterAll(async () => {
  await User.deleteOne({ _id: userId });
  await Product.deleteMany({});
});
