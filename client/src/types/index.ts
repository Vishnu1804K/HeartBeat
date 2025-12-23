export interface User {
    email: string;
    name: string;
    age?: number | null;
    gender?: string;
    height?: number | null;
    weight?: number | null;
    medicalConditions?: string[];
    fitnessGoals?: FitnessGoal[];
    vitalSigns?: VitalSign[];
    healthcareProviders?: HealthcareProvider[];
    appointments?: Appointment[];
}

export interface FitnessGoal {
    id?: string;
    goal: string;
    progress: number;
    target: number;
}

export interface VitalSign {
    id: string;
    type: string;
    value: string;
    recordedAt: string;
}

export interface Activity {
    id: string;
    type: string;
    duration: number;
    distance?: number | null;
    caloriesBurned: number;
    intensity: 'low' | 'medium' | 'high';
    recordedAt: string;
}

export interface HealthcareProvider {
    id: string;
    name: string;
    type: 'doctor' | 'hospital' | 'insurance' | 'clinic' | 'specialist';
    specialty?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
    createdAt: string;
}

export interface Appointment {
    id: string;
    providerId?: string;
    providerName: string;
    date: string;
    time: string;
    purpose: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
    createdAt: string;
}

export interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'article' | 'video' | 'podcast';
    category: string;
    url: string;
    thumbnail?: string;
    duration?: string;
    author?: string;
    tags: string[];
    createdAt: string;
}

export interface Recommendation {
    category: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
}

export interface Category {
    id: string;
    name: string;
    icon: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    checkAuth: () => Promise<void>;
}

