require("dotenv").config({
  path: process.env.NODE_ENV === "development" ? "./.dev.env" : "./.prod.env",
});
const request = require("supertest");
const { app } = require("../index");
const mongoose = require("mongoose");

beforeAll(async () => {
  //connects to the database
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // Clears the database and adds some testing data.
  const collections = await mongoose.connection.db.listCollections().toArray();
  if (collections.includes("users")) {
    console.log("has user");
    return mongoose.connection.db.dropCollection("users");
  } else {
    return;
  }
});

// beforeEach(populateDB)
describe("testing user registration flow", () => {
  test("if it rejects username shorter then the required", async () => {
    const response = await request(app)
      .post("/user/register")
      .send({
        userName: "te",
        password: "test",
      })
      .expect(422);
    expect(response.body.errors[0].msg).toBe(
      "userName must be between 3 and 20 characters"
    );
  });
  test("if it rejects passwords shorter then the required", async () => {
    const response = await request(app)
      .post("/user/register")
      .send({
        userName: "testyurfd",
        password: "te",
      })
      .expect(422);
    expect(response.body.errors[0].msg).toBe(
        "password must be between 8 and 20 characters",
    );
  });
});
