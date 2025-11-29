import app from "./app";
import connectDB from "./config/db";
import dotenv from 'dotenv'

dotenv.config({
    path:'./.env'
})

connectDB()

const port = process.env.PORT || 5000;

import authRoute from './routes/user.route'
app.use('/api/v1/auth',authRoute)

import todoRoute from './routes/todo.route'
app.use('/api/v1/todo',todoRoute)

app.listen(port,()=>{
    console.log(`App listening on port: ${port}`)
})
