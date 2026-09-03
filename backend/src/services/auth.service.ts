import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { LoginInput, RegisterInput } from '../schemas/auth.schema.js';
import { logAudit } from '../utils/audit.js';

export const generateToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_land_records_2026_secure';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn } as any
  );
};

export const registerUserService = async (input: RegisterInput, ipAddress?: string) => {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const user = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.password,
    role: input.role,
    department: input.department,
    district: input.district,
    status: 'ACTIVE',
  });

  await logAudit({
    userId: user._id as any,
    action: 'USER_CREATED',
    resourceType: 'User',
    resourceId: user._id.toString(),
    description: `User self-registered as ${user.role} in department ${user.department}`,
    ipAddress,
  });

  const token = generateToken(user);
  return { user, token };
};

export const loginUserService = async (input: LoginInput, ipAddress?: string) => {
  const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  if (user.status !== 'ACTIVE') {
    throw new Error(`Account is ${user.status.toLowerCase()}. Please contact an administrator.`);
  }

  const isMatch = await user.comparePassword(input.password);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  user.lastLogin = new Date();
  await user.save();

  await logAudit({
    userId: user._id as any,
    action: 'USER_LOGIN',
    resourceType: 'Auth',
    resourceId: user._id.toString(),
    description: `User ${user.email} logged in successfully`,
    ipAddress,
  });

  const token = generateToken(user);
  // remove password before returning
  const userObj = user.toJSON();
  return { user: userObj, token };
};
