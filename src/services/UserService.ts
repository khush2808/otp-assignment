import { User, IUser } from '../models/user.model';

export class UserService {
	async getAllUsers(): Promise<IUser[]> {
		return User.find().select('-password');
	}

	async getUserById(id: string): Promise<IUser | null> {
		return User.findOne({ id }).select('-password');
	}

	async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
		return User.findOneAndUpdate({ id }, updateData, { new: true }).select('-password');
	}

	async deleteUser(id: string): Promise<boolean> {
		const result = await User.findOneAndDelete({ id });
		return !!result;
	}
}

export const userService = new UserService();