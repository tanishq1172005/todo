import { Router } from "express";
import { deleteTodo, updateTodo,addTodo,getTodo } from "../controllers/todo.controller";


const router = Router()

router.post('/add',addTodo)
router.get('/all',getTodo)
router.put('/update/:id',updateTodo)
router.delete('/delete/:id',deleteTodo)


export default router