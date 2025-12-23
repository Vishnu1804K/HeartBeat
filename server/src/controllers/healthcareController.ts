import { Response } from 'express';
import { AuthRequest, IHealthcareProvider, IAppointment } from '../types';

// @desc    Add healthcare provider
// @route   POST /api/v1/healthcare-providers
export const addProvider = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, type, specialty, phone, email, address, notes } = req.body;

        if (!name || !type) {
            res.status(400).json({ error: 'Name and type are required' });
            return;
        }

        const user = req.user!;

        user.healthcareProviders.push({
            name,
            type,
            specialty,
            phone,
            email,
            address,
            notes,
            createdAt: new Date()
        } as IHealthcareProvider);

        await user.save();

        res.status(200).json({ message: 'Healthcare provider added successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid request body' });
    }
};

// @desc    Get all healthcare providers
// @route   GET /api/v1/healthcare-providers
export const getProviders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;

        res.status(200).json({
            providers: user.healthcareProviders.map((p) => ({
                id: p._id,
                name: p.name,
                type: p.type,
                specialty: p.specialty,
                phone: p.phone,
                email: p.email,
                address: p.address,
                notes: p.notes,
                createdAt: p.createdAt
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update healthcare provider
// @route   PUT /api/v1/healthcare-providers/:id
export const updateProvider = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, type, specialty, phone, email, address, notes } = req.body;
        const user = req.user!;

        const providerIndex = user.healthcareProviders.findIndex(
            (p) => p._id?.toString() === req.params.id
        );

        if (providerIndex === -1) {
            res.status(404).json({ error: 'Provider not found' });
            return;
        }

        const provider = user.healthcareProviders[providerIndex];
        if (name) provider.name = name;
        if (type) provider.type = type;
        if (specialty !== undefined) provider.specialty = specialty;
        if (phone !== undefined) provider.phone = phone;
        if (email !== undefined) provider.email = email;
        if (address !== undefined) provider.address = address;
        if (notes !== undefined) provider.notes = notes;

        await user.save();

        res.status(200).json({ message: 'Provider updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid request body' });
    }
};

// @desc    Delete healthcare provider
// @route   DELETE /api/v1/healthcare-providers/:id
export const deleteProvider = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;

        const providerIndex = user.healthcareProviders.findIndex(
            (p) => p._id?.toString() === req.params.id
        );

        if (providerIndex !== -1) {
            user.healthcareProviders.splice(providerIndex, 1);
            await user.save();
        }

        res.status(200).json({ message: 'Provider deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Schedule appointment
// @route   POST /api/v1/appointments
export const scheduleAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { providerId, providerName, date, time, purpose, notes } = req.body;

        if (!providerName || !date || !time || !purpose) {
            res.status(400).json({ error: 'Provider name, date, time and purpose are required' });
            return;
        }

        const user = req.user!;

        user.appointments.push({
            providerId,
            providerName,
            date: new Date(date),
            time,
            purpose,
            status: 'scheduled',
            notes,
            createdAt: new Date()
        } as IAppointment);

        await user.save();

        res.status(200).json({ message: 'Appointment scheduled successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid request body' });
    }
};

// @desc    Get all appointments
// @route   GET /api/v1/appointments
export const getAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;

        res.status(200).json({
            appointments: user.appointments.map((a) => ({
                id: a._id,
                providerId: a.providerId,
                providerName: a.providerName,
                date: a.date,
                time: a.time,
                purpose: a.purpose,
                status: a.status,
                notes: a.notes,
                createdAt: a.createdAt
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Update appointment status
// @route   PUT /api/v1/appointments/:id
export const updateAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { date, time, purpose, status, notes } = req.body;
        const user = req.user!;

        const appointmentIndex = user.appointments.findIndex(
            (a) => a._id?.toString() === req.params.id
        );

        if (appointmentIndex === -1) {
            res.status(404).json({ error: 'Appointment not found' });
            return;
        }

        const appointment = user.appointments[appointmentIndex];
        if (date) appointment.date = new Date(date);
        if (time) appointment.time = time;
        if (purpose) appointment.purpose = purpose;
        if (status) appointment.status = status;
        if (notes !== undefined) appointment.notes = notes;

        await user.save();

        res.status(200).json({ message: 'Appointment updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid request body' });
    }
};

// @desc    Delete appointment
// @route   DELETE /api/v1/appointments/:id
export const deleteAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;

        const appointmentIndex = user.appointments.findIndex(
            (a) => a._id?.toString() === req.params.id
        );

        if (appointmentIndex !== -1) {
            user.appointments.splice(appointmentIndex, 1);
            await user.save();
        }

        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
