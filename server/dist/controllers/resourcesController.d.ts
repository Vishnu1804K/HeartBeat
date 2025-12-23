import { Request, Response } from 'express';
import { AuthRequest } from '../types';
export declare const getResources: (req: Request, res: Response) => Promise<void>;
export declare const getResource: (req: Request, res: Response) => Promise<void>;
export declare const saveResource: (req: AuthRequest, res: Response) => Promise<void>;
export declare const unsaveResource: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSavedResources: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCategories: (_req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=resourcesController.d.ts.map