const exp=require('express')
const task=require('../models/task')
const tsks=new exp.Router()
const auth=require('../middleware/auth')

tsks.patch('/tasks/:id',auth, async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowed=['description','completed']
    const isvalidont=updates.every((upt)=>{
        return allowed.includes(upt)})
    if(!isvalidont){
        return res.status(404).send({error:"invalid updations"})
    }
    try{
        const tsk=await task.findOne({_id:req.params.id,owner:req.users._id})
        if(!tsk){
            return res.status(404).send()
        }
        updates.forEach((update)=>tsk[update]=req.body[update])
        await tsk.save()
        res.status(201).send(tsk)
    }catch(e){
        res.status(400).send(e)
    }
})


tsks.delete('/tasks/:id', async(req,res)=>{
    try{
        const dt=await task.findByIdAndDelete(req.params.id)
        if(!dt){
            return res.status(404).send()
        }
    res.status(201).send(dt)
    }catch(e){
        res.status(500).send(e)
    }

})

//

tsks.get('/tasks',auth, async (req,res)=>{
    try{
        if(req.query.completed=='true'){
            qt=true
            const tasks=await task.find({owner:req.users._id,completed:qt})
            return res.send(tasks).status(201)
        }
        else if(req.query.completed=='false'){
            qt=false
            const tasks=await task.find({owner:req.users._id,completed:qt})
            return res.send(tasks).status(201)
        }
        else{
            const tasks=await task.find({owner:req.users._id})
            return res.send(tasks).status(201)
        }
    }
    catch(e){
        res.send(e).status(500)
    }
    
})

tsks.get('/tasks/:id',auth, async (req,res)=>{
    try{
        const _id=req.params.id
        const tks=await task.findOne({_id,owner:req.users._id})
        if(!tks){
           return  res.status(404).send()
        }
        console.log(tks.owner)
        res.status(201).send(tks)
    }catch(e){
        res.status(500).send(e)
    }
})


tsks.post('/tasks',auth,async (req,res)=>{
    const tk=new task({...req.body,owner:req.users._id})
    try{
        await tk.save()
        res.send(tk).status(201)
    }catch(e){
        res.send(e).status(500)
    }
})


module.exports=tsks