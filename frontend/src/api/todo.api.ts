import axios from 'axios';
import { API_PATHS, BASE_URL } from '../utils/apiPath';
import type { CreateTodoInput, Todo, UpdateTodoInput } from '../schemas/todo.schema';

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})


export const getTodos = async (): Promise<Todo[]> => {
    const response = await api.get(API_PATHS.TODO.GET_TODO);
    return response.data; // Backend returns the array directly
};

export const addTodo = async (data: CreateTodoInput): Promise<Todo> => {
    const response = await api.post(API_PATHS.TODO.ADD_TODO, data);
    return response.data.todo; // Backend returns { todo: { ... } }
};

export const updateTodo = async ({ id, data }: { id: string; data: UpdateTodoInput }): Promise<Todo> => {
    const response = await api.put(`${API_PATHS.TODO.UPDATE_TODO}/${id}`, data);
    return response.data.updatedTodo; // Backend returns { message, updatedTodo }
};

export const deleteTodo = async (id: string): Promise<void> => {
    await api.delete(`${API_PATHS.TODO.DELETE_TODO}/${id}`);
};
