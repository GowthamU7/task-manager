const exp=require("express")
require('./db/mongoose')
const userroute=require('./routers/user')
const taskroute=require('./routers/tasks')
const crypt=require("bcryptjs")

const app=exp()

const port=process.env.PORT
const ml=require('multer')

app.use(exp.json())

app.use(userroute)
app.use(taskroute)


app.listen(port,()=>{
    console.log("SERVER IS UP ON....."+port)
})
