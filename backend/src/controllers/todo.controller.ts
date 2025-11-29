import { RequestHandler } from "express"
import { Todo } from "../models/todo.model";

const addTodo:RequestHandler=async(req,res)=>{
    try{
        const {todo} = req.body;
    if(!todo){
        return res.status(400).json({message:"Please fill out all fields"})
    }
    await Todo.create({
        todo
        })
    return res.status(200).json({
        todo,
        })
    }catch(err:any){
        return res.status(500).json({message:"Server Error",err:err.message})
    }
    
}

const getTodo:RequestHandler=async(req,res)=>{
    try{
        const todos = await Todo.find()
        res.json(todos)
    }catch(err:any){
        return res.status(500).json({message:"Server Error",err:err.message})
    }
}

const deleteTodo:RequestHandler=async(req,res)=>{
    try{
    const todoId = req.params.id
     if(!todoId){
        return res.status(404).json({message:"Todo not found"})
     } 
     const todo = await Todo.findByIdAndDelete(todoId)
     res.status(200).json({message:"Todo deleted successfully"})
    }catch(err:any){
        return res.status(500).json({message:"Server Error",err:err.message})
    }
}

const updateTodo:RequestHandler=async(req,res)=>{
    try{
        const todoId = req.params.id
        if(!todoId){
        return res.status(404).json({message:"Todo not found"})
     } 
        const {todo} = req.body;
        const updatedTodo = await Todo.findOneAndUpdate({_id:todoId},{todo},{new:true})
        return res.status(200).json({message:"Todo updated successfully",updatedTodo})        
    }catch(err:any){
        return res.status(500).json({message:"Server Error",err:err.message})
    }
}



export {getTodo,addTodo,updateTodo,deleteTodo}