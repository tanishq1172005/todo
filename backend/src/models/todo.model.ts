import mongoose,{Document, Schema} from "mongoose";

export interface Todo extends Document{
    todo:string,
   
}

const todoSchema:Schema<Todo> = new mongoose.Schema({
    todo:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Todo = mongoose.model("Todo",todoSchema)