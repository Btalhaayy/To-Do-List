import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../config/db.config';

interface Todo extends RowDataPacket {
  id: number;
  text: string;
  completed: boolean;
  date: string;
}

export const createTodo = async (req: Request, res: Response) => {
  try {
    console.log('Request body:', req.body);
    
    const { text, completed, date } = req.body;

    if (!text || !date) {
      console.log('Validation failed:', { text, date });
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: 'Text and date are required' 
      });
    }

    const query = 'INSERT INTO todos (text, completed, date) VALUES (?, ?, ?)';
    const values = [text, completed || false, date];
    console.log('Executing SQL:', { query, values });

    const [result] = await pool.execute<ResultSetHeader>(query, values);
    console.log('SQL Result:', result);

    const newTodo = {
      id: result.insertId,
      text,
      completed: completed || false,
      date
    };

    console.log('Created todo:', newTodo);
    return res.status(201).json(newTodo);

  } catch (error: any) {
    console.error('Server Error:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
};

export const getTodos = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute<Todo[]>('SELECT * FROM todos');
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Error fetching todos' });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { completed } = req.body;
  
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE todos SET completed = ? WHERE id = ?',
      [completed, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo updated successfully' });
  } catch (error: any) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Error updating todo' });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM todos WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Error deleting todo' });
  }
};