const User = require("../../Models/User");

module.exports =  async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.getToken()
        await user.save()
        
        res.status(201).send({
            ...user.toJSON(),
            token
        })
    } catch (e) {
        console.error(e);
        res.status(500).send(e)
        
    }
}