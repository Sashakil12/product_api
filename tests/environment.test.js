require('dotenv').config({path:__dirname+"/../.test.env"})

describe("testing environment",()=>{
    test("check node env is test",()=>{
        console.log(process.env.DB_URL)
        expect(process.env.NODE_ENV).toBe("test");
    } )
})