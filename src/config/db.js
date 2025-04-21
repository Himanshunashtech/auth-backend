const mongoose = require('mongoose')


const dbconnection = async ()=>{
    await mongoose.connect(process.env.DB_URI).then(()=>{
        console.log("database connected")
    }).catch((error)=>{
        console.log(error,"somthing went wrong")
        process.exit(1)
    })
}


module.exports = dbconnection