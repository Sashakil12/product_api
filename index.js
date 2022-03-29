const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//routers
    //      --> user router
const userRouter = require('./routers/user');

app.use(express.json())



module.exports = {app, port}