const mg=require('mongoose')
const vl=require('validator')



const taskschema=new mg.Schema({
    description:{
        type:String,
        required:true,
        validator(value){
            if(!vl.isAlpha(value)){
                throw new Error('needs to be string')

            }
        }
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mg.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    }
},{timestamps:true})

const task=mg.model('task',taskschema)

module.exports=task