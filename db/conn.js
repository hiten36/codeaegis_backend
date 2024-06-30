const mongoose=require('mongoose');

mongoose.connect(process.env.DB).then(()=>{
    console.log('Database Connected');
}).catch((error)=>{
    console.log(error?.message);
});

module.exports=mongoose;