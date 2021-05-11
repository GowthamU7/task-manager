const jwt=require('jsonwebtoken')
const user=require('../models/user')



const auth=async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token,process.env.jwt_secret)
        const users=await user.findOne({_id:decoded._id,'tokens.token':token})
        if(!users){
            throw new Error()
        }
        req.token=token
        req.users=users
        next()
    }  catch(e){
        console.log(e)
        res.status(404).send("plz authenticate")
    }
}

module.exports=auth