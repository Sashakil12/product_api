require("dotenv").config({
  path: "../.test.env",
});

const request = require("supertest");
const { app } = require("../index");
const mongoose = require("mongoose");

const Product = require("../Models/Product");
const seedData = require("./fixtures/productsSeedData.js");
beforeAll(async () => {
  //connects to the database
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Clears the database and adds some testing data.
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(collections);
    if (collections.find((el) => el.name === "products")) {
      console.log("has user");
      await mongoose.connection.db.dropCollection("products");
    } else {
      await mongoose.connection.db.createCollection("products");
    }
    return mongoose.connection.db
      .collection("products")
      .createIndex({ name: 1 }, { unique: true });
  } catch (e) {
    console.log(e);
    throw e;
  }
}, 30000);

describe("testing public product fetch route calls with valid/invalid params", () => {
  test("it rejects a request without the query param limit", async () => {
    const response = await request(app).get("/product?skip=0").expect(422);
    expect(response.body.errors[0].msg).toBe("limit is required");
  });
  test("it rejects a request without the query param skip", async () => {
    const response = await request(app).get("/product?limit=0").expect(422);
    expect(response.body.errors[0].msg).toBe("skip is required");
  });
  test("it rejects a request without both query and limit", async () => {
    const response = await request(app).get("/product").expect(422);
    expect(response.body.errors[0].msg).toBe("limit is required");
    expect(response.body.errors[2].msg).toBe("skip is required");
  });
  test("it rejects a request with a negative value for limit", async () => {
    const response = await request(app)
      .get("/product?limit=-8" + "&skip=0")
      .expect(422);
    expect(response.body.errors[0].msg).toBe(
      "invalid parameter 'limit' must be a number between 0 and 250"
    );
  });
  test("it rejects a request with a negative value for skip", async () => {
    const response = await request(app)
      .get("/product?limit=8" + "&skip=-25")
      .expect(422);
    expect(response.body.errors[0].msg).toBe(
      "invalid parameter 'skip' must be a number greater than 0"
    );
  });
  test("it rejects a request with a limit value greater that 250", async () => {
    const response = await request(app)
      .get("/product?limit=255" + "&skip=25")
      .expect(422);
    expect(response.body.errors[0].msg).toBe(
      "invalid parameter 'limit' must be a number between 0 and 250"
    );
  });
});

describe("checking public fetch products behaviors with no product data on db", () => {
  test("returns an empty array when there is no products", async () => {
    const response = await request(app)
      .get("/product?limit=250" + "&skip=0")
      .expect(200);
    expect(response.body).toEqual([]);
  });
});

describe("checking public fetch products behaviors with products data on db", () => {
  beforeAll(async () => {
    return await Product.insertMany([...seedData]);
  });
  test("returns a product array when there is products with only approved products", async () => {
    const response = await request(app)
      .get("/product?limit=249" + "&skip=0")
      .expect(200);
    console.log(response);
    expect(response.body.length).toEqual(
      seedData.filter((el) => el.status === "available").length
    );
  });

  afterAll(async () => {
    await Product.deleteMany({});
  });
});
