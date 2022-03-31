require("dotenv").config({
  path: "../.test.env",
});

const request = require("supertest");
const { app } = require("../index");
const mongoose = require("mongoose");

const Product = require("../Models/Product");
const User = require("../Models/User");
const seedData = require("./fixtures/productsSeedData.js");
let token;
let userId;
const userData = {
  userName: "demouser45",
  password: "test123456",
};

beforeAll(async () => {
  //connects to the database
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    //register User
    const response = await request(app).post("/user/register").send(userData);
    token = response.body.token;
    userId = response.body._id;

    // Clears the database and adds some testing data.

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    if (collections.find((el) => el.name === "products")) {
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

describe("testing authenticated product fetch route calls with valid/invalid params", () => {
  test("it rejects a request without the query param limit", async () => {
    const response = await request(app)
      .get("/product/all?skip=0")
      .set("Authorization", "Bearer " + token)
      .expect(422);
    expect(response.body.errors[0].msg).toBe("limit is required");
  });
  test("it rejects a request without the query param skip", async () => {
    const response = await request(app).get("/product/all?limit=0").expect(422);
    expect(response.body.errors[0].msg).toBe("skip is required");
  });
  test("it rejects a request without both query and limit", async () => {
    const response = await request(app).get("/product/all").expect(422);
    expect(response.body.errors[0].msg).toBe("limit is required");
    expect(response.body.errors[2].msg).toBe("skip is required");
  });
  test("it rejects a request with a negative value for limit", async () => {
    const response = await request(app)
      .get("/product/all?limit=-8" + "&skip=0")
      .expect(422);
    expect(response.body.errors[0].msg).toBe(
      "invalid parameter 'limit' must be a number between 0 and 250"
    );
  });
  test("it rejects a request with a negative value for skip", async () => {
    const response = await request(app)
      .get("/product/all?limit=8" + "&skip=-25")
      .expect(422);
    expect(response.body.errors[0].msg).toBe(
      "invalid parameter 'skip' must be a number greater than 0"
    );
  });
  test("it rejects a request with a limit value greater that 250", async () => {
    const response = await request(app)
      .get("/product/all?limit=255" + "&skip=25")
      .expect(422);
    expect(response.body.errors[0].msg).toBe(
      "invalid parameter 'limit' must be a number between 0 and 250"
    );
  });
});

describe("checking authenticated fetch products behaviors with no product data on db", () => {
  test("returns an empty array when there is no products", async () => {
    const response = await request(app)
      .get("/product/all?limit=250" + "&skip=0")
      .set("Authorization", "Bearer " + token)
      .expect(200);
    expect(response.body).toEqual([]);
  });
});

describe("checking authenticated fetch products behaviors with products data on db", () => {
  beforeAll(async () => {
    return await Product.insertMany([...seedData]);
  });
  test("returns a product array with approved products when there is products", async () => {
    const response = await request(app)
      .get("/product/all?limit=249" + "&skip=0")
      .set("Authorization", "Bearer " + token)
      .expect(200);

    expect(response.body.length).toEqual(seedData.length);
  });

  afterAll(async () => {
    await Product.deleteMany({});
    await User.deleteOne({ _id: userId });
  });
});
