import { Router } from 'express';
import { authService } from '../services/AuthService';
import { validate } from '../middleware/validate';
import { createUserSchema, loginSchema, otpSchema, verifyOtpSchema } from '../schemas/user.schema';

const router = Router();

router.post('/signup',  async (req, res) => {
  try {
    const { user, token } = await authService.signup(req.body);
    res.status(201).json({ user, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login',  async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.json({ user, token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/otp/send', async (req, res) => {
  try {
    await authService.sendOTP(req.body.email);
    res.json({ message: 'OTP sent successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/otp/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const { user, token } = await authService.verifyOTP(email, otp);
    res.json({ user, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;