const mg=require('mongoose')
const vl=require('validator')
const jwt = require('jsonwebtoken')
const task=require('../models/task')


const userschema = new mg.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
            type:String,
            unique:true,
            required:true,
            trim:true,
            lowercase:true,
            validator(value){
                if(!vl.isEmail(value)){
                    throw new Error(" enter a valid email")
                }
            }
        },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be a psitive number')
            }
        }
    },
    password:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
            validate(value){
                if(value.length<8){
                    throw new Error("set a strong one")
                }
                if(value.includes("password")){
                    throw new Error("set a strong one")

                    }
                }
},
tokens:[{
    token:{
        type:String,
        required:true
    }
}],
avatar:{
    type:Buffer
}
},{timestamps:true})

userschema.virtual('tasks',{
    ref:"task",
    localField:'_id',
    foreignField:'owner'
})


userschema.methods.generateauthtoken=async function(){
    const us=this
    const token=await jwt.sign({_id:us._id.toString()},process.env.jwt_secret)
    us.tokens.push({token})
    await us.save()
    return token
}

userschema.methods.toJSON=function(){
    const us=this
    const usobject=us.toObject()
    delete usobject.password
    delete usobject.tokens
    delete usobject.avatar
    return usobject

}

userschema.statics.findbycred= async function(email,password){
    const us=await user.findOne({email})
    console.log(us)
    if(!us){
        throw new Error("User not found")
    }
    if(password!==us.password){
        throw new Error("Unable_To_Login")
    }
    return us

}

userschema.pre('save',async function(next){
    const users=this
    if(users.isModified('password')){
            users.password=users.password
    }
    next()
})
//deletes the tasks related to user 
userschema.pre('remove',async function(next){
    const us=this
    await task.deleteMany({owner:us._id})
    next()

})


const user=mg.model('user',userschema)

module.exports=user
