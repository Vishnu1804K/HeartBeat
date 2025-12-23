import { Response } from 'express';
import { AuthRequest } from '../types';
export declare const addProvider: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getProviders: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProvider: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteProvider: (req: AuthRequest, res: Response) => Promise<void>;
export declare const scheduleAppointment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAppointments: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateAppointment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteAppointment: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=healthcareController.d.ts.map