import { z } from 'zod';

export const TodoSchema = z.object({
    _id: z.string(),
    todo: z.string().min(1, 'Todo is required'),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    // isCompleted is not in backend model, so we can't really rely on it from API
    // but we might use it for optimistic UI if we were to support it
});

export const CreateTodoSchema = z.object({
    todo: z.string().min(1, 'Todo is required'),
});

export const UpdateTodoSchema = z.object({
    todo: z.string().min(1, 'Todo is required'),
});

export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;
