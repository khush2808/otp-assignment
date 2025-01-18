import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { OTP } from '../models/otp.model';
import { config } from '../config';
import { emailService } from './EmailService';

export class AuthService {
	private generateToken(userId: string): string {
		return jwt.sign({ userId }, config.jwtSecret, {
			expiresIn: config.jwtExpiresIn,
		});
	}

	private generateOTP(): string {
		return Math.floor(100000 + Math.random() * 900000).toString();
	}

	async signup(userData: Partial<IUser>): Promise<{ user: IUser; token: string }> {
		console.log("this is user data", userData);
		const user = await User.create(userData);
		console.log("this is user", user);
		const token = this.generateToken(user.id.toString());
		return { user, token };
	}

	async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
		const user = await User.findOne({ email });
		if (!user || !user?.isValidated) {
			throw new Error('User not validated. Please verify your email');
		}

		if (!user || !(await user.comparePassword(password))) {
			throw new Error('Invalid credentials');
		}

		const token = this.generateToken(user.id.toString());
		return { user, token };
	}

	async sendOTP(email: string): Promise<void> {
		const otp = this.generateOTP();
		await OTP.findOneAndUpdate(
			{ email },
			{ otp, expiresAt: new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000) },
			{ upsert: true }
		);
		await emailService.sendOTP(email, otp);
	}

	async verifyOTP(email: string, otp: string): Promise<{ user: IUser; token: string }> {
		const otpDoc = await OTP.findOne({
			email,
			otp,
			expiresAt: { $gt: new Date() },
		});

		if (!otpDoc) {
			throw new Error('Invalid or expired OTP');
		}

		let user = await User.findOneAndUpdate(
			{ email },
			{ $set: { isValidated: true } },
			{ new: true } // Return the updated document
		);
		await OTP.deleteOne({ _id: otpDoc._id });
		if (!user) {
			throw new Error('User not found');
		}
		const token = this.generateToken(user.id.toString());
		return { user, token };
	}
}

export const authService = new AuthService();