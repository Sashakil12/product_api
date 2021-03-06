require("dotenv").config({
  path:
  require("fs").existsSync("./.dev.env")
      ? "./.dev.env"
      : "./.prod.env",
});

console.log(process.env.NODE_ENV);
const { app, port } = require("./index");
const mongoose = require("mongoose");

const init = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await app.listen(port);
    console.log("app is listening on port " + port);
  } catch (e) {
    console.error("Error initializing the server");
    console.error(e);
  }
};

init();
