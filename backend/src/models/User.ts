import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'ADMIN' | 'OFFICER' | 'VERIFIER' | 'VIEWER' | 'CITIZEN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type AccountStatus =
  | 'PENDING_VERIFICATION'
  | 'PENDING_APPROVAL'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'DISABLED';

export interface IUser extends MongooseDocument {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department: string;
  district: string;
  status: UserStatus;
  accountStatus?: AccountStatus;
  preferredLanguage?: string;
  emailVerified?: boolean;
  emailVerifiedAt?: Date;
  mobile?: string;
  mobileVerified?: boolean;
  mobileVerifiedAt?: Date;
  mobileVerificationMethod?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    emailVerifiedAt: {
      type: Date,
    },
    mobile: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
    },
    mobileVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    mobileVerifiedAt: {
      type: Date,
    },
    mobileVerificationMethod: {
      type: String,
      default: 'SMS',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'OFFICER', 'VERIFIER', 'VIEWER', 'CITIZEN'],
      default: 'CITIZEN',
      index: true,
    },
    department: {
      type: String,
      default: 'Citizen Services',
      trim: true,
      index: true,
    },
    district: {
      type: String,
      default: 'Maharashtra',
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
      default: 'ACTIVE',
      index: true,
    },
    accountStatus: {
      type: String,
      enum: [
        'PENDING_VERIFICATION',
        'PENDING_APPROVAL',
        'ACTIVE',
        'SUSPENDED',
        'DISABLED',
      ],
      default: 'ACTIVE',
      index: true,
    },
    preferredLanguage: {
      type: String,
      default: 'en',
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Compound indexes for fast admin querying & filtering
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ role: 1, accountStatus: 1 });
UserSchema.index({ district: 1, department: 1 });
UserSchema.index({ createdAt: -1 });


// Password hashing middleware
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
