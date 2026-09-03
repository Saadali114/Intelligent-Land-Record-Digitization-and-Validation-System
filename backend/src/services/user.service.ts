import { User, IUser, UserStatus } from '../models/User.js';
import { CreateUserInput, UpdateUserInput, UserQueryInput } from '../schemas/user.schema.js';
import { PaginationMeta } from '../utils/response.js';
import { logAudit } from '../utils/audit.js';

export const getUsersService = async (query: UserQueryInput) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};

  if (query.role) {
    filter.role = query.role;
  }
  if (query.status) {
    filter.status = query.status;
  }
  if (query.district) {
    filter.district = { $regex: query.district, $options: 'i' };
  }
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
      { department: { $regex: query.search, $options: 'i' } },
      { district: { $regex: query.search, $options: 'i' } },
    ];
  }

  const sortField = query.sortBy || 'createdAt';
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1;

  const [total, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const pagination: PaginationMeta = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };

  return { users, pagination };
};

export const getUserByIdService = async (id: string) => {
  const user = await User.findById(id).lean();
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const createUserService = async (input: CreateUserInput, actorId?: string, ip?: string) => {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new Error('A user with this email address already exists.');
  }

  const user = await User.create({
    ...input,
    email: input.email.toLowerCase(),
  });

  await logAudit({
    userId: actorId as any,
    action: 'USER_CREATED',
    resourceType: 'User',
    resourceId: user._id.toString(),
    description: `Admin created user ${user.email} with role ${user.role}`,
    ipAddress: ip,
  });

  return user.toJSON();
};

export const updateUserService = async (
  id: string,
  input: UpdateUserInput,
  actorId?: string,
  ip?: string
) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  if (input.email && input.email.toLowerCase() !== user.email) {
    const existing = await User.findOne({ email: input.email.toLowerCase() });
    if (existing) {
      throw new Error('Email address is already in use by another account');
    }
    user.email = input.email.toLowerCase();
  }

  if (input.name) user.name = input.name;
  if (input.role) user.role = input.role;
  if (input.department) user.department = input.department;
  if (input.district) user.district = input.district;
  if (input.status) user.status = input.status;
  if (input.password) user.password = input.password;

  await user.save();

  await logAudit({
    userId: actorId as any,
    action: 'USER_UPDATED',
    resourceType: 'User',
    resourceId: user._id.toString(),
    description: `User ${user.email} details updated`,
    ipAddress: ip,
  });

  return user.toJSON();
};

export const updateUserStatusService = async (
  id: string,
  status: UserStatus,
  actorId?: string,
  ip?: string
) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  user.status = status;
  await user.save();

  await logAudit({
    userId: actorId as any,
    action: 'USER_STATUS_CHANGED',
    resourceType: 'User',
    resourceId: user._id.toString(),
    description: `Status for ${user.email} changed to ${status}`,
    ipAddress: ip,
  });

  return user.toJSON();
};

export const deleteUserService = async (id: string, actorId?: string, ip?: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  if (user._id.toString() === actorId) {
    throw new Error('Administrators cannot delete their own account.');
  }

  await User.findByIdAndDelete(id);

  await logAudit({
    userId: actorId as any,
    action: 'USER_DELETED',
    resourceType: 'User',
    resourceId: id,
    description: `User ${user.email} (${user.role}) was deleted`,
    ipAddress: ip,
  });

  return { id };
};
