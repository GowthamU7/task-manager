const mg=require('mongoose')

mg.connect(process.env.mongodb_url,
{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:false})