require('../src/db/mongoose')

const task=require('../src/models/task')

task.findByIdAndDelete('608fee8cfcc6eb8794b4f5fb').then(()=>{
    console.log("Task Deleted")
    return task.countDocuments({completed:true})
}).then((dt)=>{
    console.log(dt)
}).catch((e)=>{
    console.log(e)
})