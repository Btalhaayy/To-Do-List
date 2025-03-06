import { Router, Request, Response } from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todo.controller';

const router = Router();

// Route handler'ları RequestHandler olarak tip tanımlama
router.get('/todos', async (req: Request, res: Response) => {
  await getTodos(req, res);
});

router.post('/todos', async (req: Request, res: Response) => {
  await createTodo(req, res);
});

router.put('/todos/:id', async (req: Request, res: Response) => {
  await updateTodo(req, res);
});

router.delete('/todos/:id', async (req: Request, res: Response) => {
  await deleteTodo(req, res);
});

export default router;