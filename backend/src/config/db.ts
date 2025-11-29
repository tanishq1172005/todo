import mongoose from "mongoose"

async function connectDB():Promise<void>{
    try{
        await mongoose.connect(process.env.MONGODB_URI!)
        .then(()=>console.log("DB connected successfully"))
        
    }catch(err){
        console.error("Database connection failed",err)
        process.exit(1)
    }
}

export default connectDB