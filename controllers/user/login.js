const User = require("../../Models/User")

module.exports =  async (req, res) => {
    try{
        const user = await User.verifyCredentials(req.body.userName, req.body.password);
        const token = await user.getToken()
        if (!user) {
            res.send(403).send()
        }
        res.send({...user.toJSON(), token})
    }catch(e){
        console.error(e)
        res.status(500).send(e)
    }
}