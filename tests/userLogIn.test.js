require('dotenv').config({path:__dirname+"/../.test.env"})

const request = require("supertest");
const { app } = require("../index");
const mongoose = require("mongoose");
const User = require("../Models/User");
let userId;
//demo user data
const userData = {
  userName: "loginuser45",
  password: "test676565",
};
beforeAll(async () => {
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const response = await request(app).post("/user/register").send(userData);
  userId = response.body._id;
  return mongoose.connection.db
    .collection("users")
    .createIndex({ userName: 1 }, { unique: true });
},30000);

describe("testing user login flow", () => {
  test("if it rejects username shorter then the required", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        userName: "ym",
        password: "test",
      })
      .expect(422);
    expect(response.body.errors[0].msg).toBe("Invalid username");
  });
  test("if it rejects passwords shorter then the required", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        userName: "kjuhyilkj",
        password: "te",
      })
      .expect(422);
    expect(response.body.errors[0].msg).toBe("Invalid password");
  });
  test("if it rejects non alphanumeric characters in username", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        userName: "testyurfd#$",
        password: "te",
      })
      .expect(422);
    expect(response.body.errors[0].param).toBe("userName");
    expect(response.body.errors[0].msg).toBe("Invalid value");
  });

  test("if it rejects request with no username", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        password: "te",
      })
      .expect(422);
    expect(response.body.errors[0].param).toBe("userName");
    expect(response.body.errors[0].msg).toBe("userName is required");
  });

  test("if it rejects request with no password", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        userName: "testyurf",
      })
      .expect(422);

    expect(response.body.errors[0].param).toBe("password");
    expect(response.body.errors[0].msg).toBe("password is required");
  });

  test("if it successfully logs in a user with valid data", async () => {
    const response = await request(app)
      .post("/user/login")
      .send(userData)
      .expect(200);
    console.log(response.body);
    expect(response.body.userName).toBe(userData.userName);
  });
});

afterAll(async () => {
  await User.deleteOne({ _id: userId });
});
