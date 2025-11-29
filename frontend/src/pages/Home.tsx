import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../api/todo.api';
import { CreateTodoSchema, type CreateTodoInput, type Todo } from '../schemas/todo.schema';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('completedTodos');
    return saved ? JSON.parse(saved) : [];
  });
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    localStorage.setItem('completedTodos', JSON.stringify(completedIds));
  }, [completedIds]);

  const { data: todos, isLoading, isError } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateTodoInput>({
    resolver: zodResolver(CreateTodoSchema),
  });

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setEditingId(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const onSubmit = (data: CreateTodoInput) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      addMutation.mutate(data);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingId(todo._id);
    setValue('todo', todo.todo);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset();
  };

  const toggleComplete = (id: string) => {
    setCompletedIds(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  if (isLoading) return <div className="text-center mt-10 text-white">Loading...</div>;
  if (isError) return <div className="text-center mt-10 text-red-500">Error fetching todos</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Todo App
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm"
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <div className="flex gap-4">
            <input
              {...register('todo')}
              type="text"
              placeholder="What needs to be done?"
              className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={addMutation.isPending || updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-blue-500/20"
            >
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Cancel
              </button>
            )}
          </div>
          {errors.todo && <p className="text-red-400 mt-2 text-sm">{errors.todo.message}</p>}
        </form>

        <div className="space-y-4">
          {todos?.map((todo) => (
            <div
              key={todo._id}
              className={`bg-gray-800 p-4 rounded-xl shadow-md border border-gray-700 flex items-center justify-between group hover:border-gray-600 transition-all duration-200 ${
                completedIds.includes(todo._id) ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => toggleComplete(todo._id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                    completedIds.includes(todo._id)
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-500 hover:border-blue-400'
                  }`}
                >
                  {completedIds.includes(todo._id) && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span
                  className={`text-lg transition-all duration-200 ${
                    completedIds.includes(todo._id) ? 'line-through text-gray-500' : 'text-gray-100'
                  }`}
                >
                  {todo.todo}
                </span>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleEdit(todo)}
                  className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => deleteMutation.mutate(todo._id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {todos?.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              <p className="text-xl">No todos yet.</p>
              <p className="text-sm">Add one above to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
