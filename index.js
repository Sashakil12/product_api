const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//importing routers
const userRouter = require('./routers/user');
const productRouter = require('./routers/products');
//config
app.use(express.json())
// using the "user" router
app.use('/user', userRouter);
app.use('/product', productRouter);

app.use(express.json())



module.exports = {app, port}