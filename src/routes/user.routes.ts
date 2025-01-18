import { Router, Request, Response } from 'express';
import { userService } from '../services/UserService';
import { auth, adminAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateUserSchema } from '../schemas/user.schema';

const router = Router();

router.get('/',  async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    // if (req.user.role !== 'admin' && req.user.id.toString() !== req.params.id) {
    //   return res.status(403).json({ error: 'Not authorized' });
    // }
    
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const success = await userService.deleteUser(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({error: error.message });
  }
});

export default router;