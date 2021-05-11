const exp=require('express')
const user=require('../models/user')
const rt=new exp.Router()
const auth=require('../middleware/auth')
const ml=require('multer')
const sharp=require('sharp')


rt.post('/users',async (req,res)=>{
    const ur=new user(req.body)
    try{
        await ur.save()
        const token=await ur.generateauthtoken()
        res.status(201).send({ur,token})
    }catch(e){
        res.status(400).send(e)
    }

})

rt.post('/users/login',async (req,res)=>{
    try{
        const users=await user.findbycred(req.body.email,req.body.password)
        const token=await users.generateauthtoken()
        res.send({users,token})
    }
    catch(e){
        res.status(400).send()
    }
})

rt.patch('/users/me',auth,async (req,res)=>{
        const updates=Object.keys(req.body)
        const allowedupdates=['name','email','age','password']
        const isvalidoperator=updates.every((updt)=> {
            return allowedupdates.includes(updt)})
        if(!isvalidoperator){
            return res.status(404).send({error:"invalid updates"})
        }
        try{
            updates.forEach((update)=>{
                req.users[update]=req.body[update]
            })
            await req.users.save()
            res.send(req.users)
        }catch(e){
            res.status(404).send(e)
        }
})

rt.post('/users/logout',auth, async(req,res)=>{
    try{
        req.users.tokens=req.users.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.users.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

rt.post('/users/logoutall',auth, async (req,res)=>{
    try{
    req.users.tokens=[]
    await req.users.save()
    res.send()
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

rt.get('/users/me',auth,async (req,res)=>{
    res.send(req.users)
})
const upload=ml({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("plz upload an image"))
        }
        cb(undefined,true)
    }
})
rt.post('/users/me/avatar',auth,upload.single('avatar'), async (req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.users.avatar=buffer
    await req.users.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

rt.delete('/users/me/avatar',auth,async (req,res)=>{
    req.users.avatar=undefined
    await req.users.save()
    res.status(200).send()
})


rt.delete('/users/me',auth ,async (req,res)=>{
    try{
        await req.users.remove()
        res.send(req.users) 
    }catch(e){
        res.status(500).send()
    }
})

rt.get('/users/:id/avatar',async (req,res)=>{
    try{
        const us=await user.findById(req.params.id)
        if(!us.avatar || !us){
            throw new Error()
        }
        res.set('Content-type','image/png')
        res.send(us.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports=rt