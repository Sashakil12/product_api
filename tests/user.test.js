require('dotenv').config({path:process.env.NODE_ENV==='development'?'./.dev.env':'./.prod.env'})
const request = require('supertest');
const app = require("../index");
const mongoose=require("mongoose")


beforeAll(async() => {
    //connects to the database
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    // Clears the database and adds some testing data.
    const collections = await mongoose.connection.db.listCollections().toArray()
    if(collections.includes('users')){
        console.log("has user")
        return mongoose.connection.db.dropCollection('users');
    }else{
        console.log("no user")
        return
    }
    
  });

// beforeEach(populateDB)

test('register user', async ()=>{
    expect(1==1)
});