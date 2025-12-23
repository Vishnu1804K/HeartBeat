import { Response } from 'express';
import { AuthRequest } from '../types';
export declare const setFitnessGoals: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getFitnessGoals: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateFitnessGoals: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteFitnessGoals: (req: AuthRequest, res: Response) => Promise<void>;
export declare const logActivity: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getActivities: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=fitnessController.d.ts.map