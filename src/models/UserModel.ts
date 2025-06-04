export interface UserModel {
  id: string;
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role?: string;
  wallet?: number;
}

// Partial interfaces for API operations
export type CreateUserModel = Omit<UserModel, 'id'>;
export type UpdateUserModel = Partial<UserModel> & { password?: string }; 
