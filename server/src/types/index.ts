import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface IFitnessGoal {
  _id?: Types.ObjectId;
  goal: string;
  progress: number;
  target: number;
  createdAt: Date;
}

export interface IVitalSign {
  _id?: Types.ObjectId;
  type: string;
  value: string;
  recordedAt: Date;
}

export interface IActivity {
  _id?: Types.ObjectId;
  type: string;
  duration: number;
  distance?: number | null;
  caloriesBurned: number;
  intensity: 'low' | 'medium' | 'high';
  recordedAt: Date;
}

export interface IHealthcareProvider {
  _id?: Types.ObjectId;
  name: string;
  type: 'doctor' | 'hospital' | 'insurance' | 'clinic' | 'specialist';
  specialty?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: Date;
}

export interface IAppointment {
  _id?: Types.ObjectId;
  providerId?: Types.ObjectId;
  providerName: string;
  date: Date;
  time: string;
  purpose: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  age?: number | null;
  gender: 'male' | 'female' | 'other' | '';
  height?: number | null;
  weight?: number | null;
  medicalConditions: string[];
  fitnessGoals: Types.DocumentArray<IFitnessGoal>;
  vitalSigns: Types.DocumentArray<IVitalSign>;
  activities: Types.DocumentArray<IActivity>;
  healthcareProviders: Types.DocumentArray<IHealthcareProvider>;
  appointments: Types.DocumentArray<IAppointment>;
  savedResources: Types.ObjectId[];
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  getSignedJwtToken(): string;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getResetPasswordToken(): string;
  save(options?: { validateBeforeSave?: boolean }): Promise<this>;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface IEducationalResource {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  type: 'article' | 'video' | 'podcast';
  category: string;
  url: string;
  thumbnail?: string;
  duration?: string;
  author?: string;
  tags: string[];
  createdAt: Date;
}
