require('../src/db/mongoose')

const user = require('../src/models/user')



// user.findByIdAndUpdate('608fe09a226f731cdcd73255',{age:22}).then((users)=>{
//     console.log(users)
//     return user.countDocuments({age:22})
// }).then((dt)=>{
//     console.log(dt)
// }).catch((e)=>{
//     console.log(e)
// })

const updateage= async (id,age,agef)=>{
    const users=await user.findByIdAndUpdate(id,{age:agef})
    const userc=await user.countDocuments({age})
    console.log(users)
    return userc
}
updateage('608fe09a226f731cdcd73255',22,23).then((userc)=>{
    console.log("count "+ userc)
}).catch((e)=>{
    console.log("Error",e)
})