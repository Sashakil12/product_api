require('dotenv').config({path:__dirname+"/../.test.env"})

console.log(process.env.DB_URL)
const request = require("supertest");
const { app } = require("../index");
const mongoose = require("mongoose");
const User = require("../Models/User");
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
    if (collections.find((el) => el.name === "users")) {
      console.log("has user");
      await mongoose.connection.db.dropCollection("users");
    } else {
      await  mongoose.connection.db.createCollection("users");
    }
    return mongoose.connection.db
        .collection("users")
        .createIndex({ userName: 1 }, { unique: true });
  } catch (e) {
    console.log(e)
    throw e;
  }
}, 30000);

describe("testing user registration flow", () => {
  test("if it rejects request with no username", async () => {
    const response = await request(app)
      .post("/user/register")
      .send({
        password: "test",
      })
      .expect(422);
    expect(response.body.errors[0].msg).toBe("userName is required");
  });
  test("if it rejects request with no password", async () => {
    const response = await request(app)
      .post("/user/register")
      .send({
        userName: "ty56uyurt4",
      })
      .expect(422);
    expect(response.body.errors[0].msg).toBe("password is required");
  });
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
      "password must be between 8 and 20 characters"
    );
  });
  test("if it rejects non alphanumeric characters in username", async () => {
    const response = await request(app)
      .post("/user/register")
      .send({
        userName: "testyurfd#$",
        password: "te",
      })
      .expect(422);
    expect(response.body.errors[0].param).toBe("userName");
    expect(response.body.errors[0].msg).toBe("Invalid value");
  });
  test("if it successfully registers a user with valid data", async () => {
    const response = await request(app)
      .post("/user/register")
      .send({
        userName: "apple564",
        password: "bingo%$#",
      })
      .expect(201);
    const user = await User.findById(response.body._id);
    console.log(user);
    expect(user).not.toBeNull();

    expect(response.body._id).toEqual(String(user._id));
  });
  test("if it rejects a registration attempt with a duplicate user name", async () => {
    const response = await request(app)
      .post("/user/register")
      .send({
        userName: "apple564",
        password: "bingo%$#78",
      })
      .expect(500);
  });
});
