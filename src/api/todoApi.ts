import { Todo } from '../types/todo.types';

const API_URL = 'http://localhost:5000/api'; // Backend portu 5000'de kalacak

export const todoApi = {
  getTodos: async (): Promise<Todo[]> => {
    const response = await fetch(`${API_URL}/todos`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },

  createTodo: async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },

  updateTodo: async (id: string, completed: boolean): Promise<void> => {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  },

  deleteTodo: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  },
};