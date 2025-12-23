import React, { useState, useEffect, FC, FormEvent, ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import {
    FiUsers,
    FiPlus,
    FiTrash2,
    FiEdit2,
    FiX,
    FiCalendar,
    FiPhone,
    FiMail,
    FiMapPin
} from 'react-icons/fi';
import { healthcareAPI } from '../services/api';
import { HealthcareProvider, Appointment } from '../types';
import './Pages.css';

interface ProviderType {
    value: string;
    label: string;
}

const providerTypes: ProviderType[] = [
    { value: 'doctor', label: 'Doctor' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'clinic', label: 'Clinic' },
    { value: 'specialist', label: 'Specialist' },
    { value: 'insurance', label: 'Insurance' }
];

interface ProviderFormData {
    name: string;
    type: string;
    specialty: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
}

interface AppointmentFormData {
    providerId: string;
    providerName: string;
    date: string;
    time: string;
    purpose: string;
    notes: string;
}

const HealthcareProviders: FC = () => {
    const [providers, setProviders] = useState<HealthcareProvider[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'providers' | 'appointments'>('providers');
    const [showProviderModal, setShowProviderModal] = useState<boolean>(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState<boolean>(false);
    const [editingProvider, setEditingProvider] = useState<string | null>(null);
    const [providerForm, setProviderForm] = useState<ProviderFormData>({
        name: '',
        type: 'doctor',
        specialty: '',
        phone: '',
        email: '',
        address: '',
        notes: ''
    });
    const [appointmentForm, setAppointmentForm] = useState<AppointmentFormData>({
        providerId: '',
        providerName: '',
        date: '',
        time: '',
        purpose: '',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (): Promise<void> => {
        try {
            const [providersRes, appointmentsRes] = await Promise.all([
                healthcareAPI.getProviders(),
                healthcareAPI.getAppointments()
            ]);
            setProviders(providersRes.data.providers || []);
            setAppointments(appointmentsRes.data.appointments || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProviderSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        try {
            if (editingProvider) {
                await healthcareAPI.updateProvider(editingProvider, providerForm);
                toast.success('Provider updated!');
            } else {
                await healthcareAPI.addProvider(providerForm);
                toast.success('Provider added!');
            }
            fetchData();
            closeProviderModal();
        } catch {
            toast.error('Failed to save provider');
        }
    };

    const handleDeleteProvider = async (id: string): Promise<void> => {
        if (!window.confirm('Delete this provider?')) return;

        try {
            await healthcareAPI.deleteProvider(id);
            toast.success('Provider deleted!');
            fetchData();
        } catch {
            toast.error('Failed to delete provider');
        }
    };

    const handleAppointmentSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        try {
            await healthcareAPI.scheduleAppointment(appointmentForm);
            toast.success('Appointment scheduled!');
            fetchData();
            closeAppointmentModal();
        } catch {
            toast.error('Failed to schedule appointment');
        }
    };

    const handleUpdateAppointmentStatus = async (id: string, status: string): Promise<void> => {
        try {
            await healthcareAPI.updateAppointment(id, { status });
            toast.success('Appointment updated!');
            fetchData();
        } catch {
            toast.error('Failed to update appointment');
        }
    };

    const handleDeleteAppointment = async (id: string): Promise<void> => {
        if (!window.confirm('Delete this appointment?')) return;

        try {
            await healthcareAPI.deleteAppointment(id);
            toast.success('Appointment deleted!');
            fetchData();
        } catch {
            toast.error('Failed to delete appointment');
        }
    };

    const openEditProvider = (provider: HealthcareProvider): void => {
        setProviderForm({
            name: provider.name,
            type: provider.type,
            specialty: provider.specialty || '',
            phone: provider.phone || '',
            email: provider.email || '',
            address: provider.address || '',
            notes: provider.notes || ''
        });
        setEditingProvider(provider.id);
        setShowProviderModal(true);
    };

    const closeProviderModal = (): void => {
        setShowProviderModal(false);
        setEditingProvider(null);
        setProviderForm({
            name: '',
            type: 'doctor',
            specialty: '',
            phone: '',
            email: '',
            address: '',
            notes: ''
        });
    };

    const closeAppointmentModal = (): void => {
        setShowAppointmentModal(false);
        setAppointmentForm({
            providerId: '',
            providerName: '',
            date: '',
            time: '',
            purpose: '',
            notes: ''
        });
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'scheduled': return 'var(--accent-sky)';
            case 'completed': return 'var(--primary-light)';
            case 'cancelled': return 'var(--accent-rose)';
            default: return 'var(--text-muted)';
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <h1>
                        <FiUsers className="page-icon" />
                        Healthcare
                    </h1>
                    <p>Manage your healthcare providers and appointments</p>
                </div>
            </header>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'providers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('providers')}
                >
                    <FiUsers />
                    Providers ({providers.length})
                </button>
                <button
                    className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('appointments')}
                >
                    <FiCalendar />
                    Appointments ({appointments.length})
                </button>
            </div>

            {/* Providers Tab */}
            {activeTab === 'providers' && (
                <>
                    <div className="section-header">
                        <h2>Healthcare Providers</h2>
                        <button className="btn-primary" onClick={() => setShowProviderModal(true)}>
                            <FiPlus />
                            Add Provider
                        </button>
                    </div>

                    {providers.length === 0 ? (
                        <div className="empty-card">
                            <div className="empty-icon">👨‍⚕️</div>
                            <h3>No Providers Added</h3>
                            <p>Add your doctors, hospitals, and insurance providers</p>
                            <button className="btn-primary" onClick={() => setShowProviderModal(true)}>
                                <FiPlus />
                                Add Your First Provider
                            </button>
                        </div>
                    ) : (
                        <div className="providers-grid">
                            {providers.map((provider: HealthcareProvider) => (
                                <div key={provider.id} className="provider-card">
                                    <div className="provider-header">
                                        <div className="provider-type-badge">{provider.type}</div>
                                        <div className="provider-actions">
                                            <button className="icon-btn" onClick={() => openEditProvider(provider)}>
                                                <FiEdit2 />
                                            </button>
                                            <button className="icon-btn danger" onClick={() => handleDeleteProvider(provider.id)}>
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                    <h3>{provider.name}</h3>
                                    {provider.specialty && <p className="specialty">{provider.specialty}</p>}
                                    <div className="provider-details">
                                        {provider.phone && (
                                            <div className="detail-row">
                                                <FiPhone />
                                                <span>{provider.phone}</span>
                                            </div>
                                        )}
                                        {provider.email && (
                                            <div className="detail-row">
                                                <FiMail />
                                                <span>{provider.email}</span>
                                            </div>
                                        )}
                                        {provider.address && (
                                            <div className="detail-row">
                                                <FiMapPin />
                                                <span>{provider.address}</span>
                                            </div>
                                        )}
                                    </div>
                                    {provider.notes && <p className="provider-notes">{provider.notes}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
                <>
                    <div className="section-header">
                        <h2>Appointments</h2>
                        <button className="btn-primary" onClick={() => setShowAppointmentModal(true)}>
                            <FiPlus />
                            Schedule Appointment
                        </button>
                    </div>

                    {appointments.length === 0 ? (
                        <div className="empty-card">
                            <div className="empty-icon">📅</div>
                            <h3>No Appointments</h3>
                            <p>Schedule appointments with your healthcare providers</p>
                            <button className="btn-primary" onClick={() => setShowAppointmentModal(true)}>
                                <FiPlus />
                                Schedule Appointment
                            </button>
                        </div>
                    ) : (
                        <div className="appointments-list">
                            {appointments.map((apt: Appointment) => (
                                <div key={apt.id} className="appointment-card">
                                    <div className="appointment-date">
                                        <span className="date">{new Date(apt.date).toLocaleDateString()}</span>
                                        <span className="time">{apt.time}</span>
                                    </div>
                                    <div className="appointment-info">
                                        <h4>{apt.providerName}</h4>
                                        <p>{apt.purpose}</p>
                                        {apt.notes && <p className="notes">{apt.notes}</p>}
                                    </div>
                                    <div className="appointment-actions">
                                        <span className="status-badge" style={{ color: getStatusColor(apt.status) }}>
                                            {apt.status}
                                        </span>
                                        {apt.status === 'scheduled' && (
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-small success"
                                                    onClick={() => handleUpdateAppointmentStatus(apt.id, 'completed')}
                                                >
                                                    Complete
                                                </button>
                                                <button
                                                    className="btn-small danger"
                                                    onClick={() => handleUpdateAppointmentStatus(apt.id, 'cancelled')}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                        <button className="icon-btn danger small" onClick={() => handleDeleteAppointment(apt.id)}>
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Provider Modal */}
            {showProviderModal && (
                <div className="modal-overlay" onClick={closeProviderModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProvider ? 'Edit Provider' : 'Add Provider'}</h2>
                            <button className="modal-close" onClick={closeProviderModal}>
                                <FiX />
                            </button>
                        </div>
                        <form onSubmit={handleProviderSubmit}>
                            <div className="form-group">
                                <label>Provider Name *</label>
                                <input
                                    type="text"
                                    value={providerForm.name}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProviderForm({ ...providerForm, name: e.target.value })}
                                    placeholder="Dr. John Smith"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type *</label>
                                    <select
                                        value={providerForm.type}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setProviderForm({ ...providerForm, type: e.target.value })}
                                        required
                                    >
                                        {providerTypes.map((t: ProviderType) => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Specialty</label>
                                    <input
                                        type="text"
                                        value={providerForm.specialty}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setProviderForm({ ...providerForm, specialty: e.target.value })}
                                        placeholder="Cardiology"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        value={providerForm.phone}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setProviderForm({ ...providerForm, phone: e.target.value })}
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={providerForm.email}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setProviderForm({ ...providerForm, email: e.target.value })}
                                        placeholder="doctor@hospital.com"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    value={providerForm.address}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProviderForm({ ...providerForm, address: e.target.value })}
                                    placeholder="123 Medical Center Dr"
                                />
                            </div>
                            <div className="form-group">
                                <label>Notes</label>
                                <textarea
                                    value={providerForm.notes}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProviderForm({ ...providerForm, notes: e.target.value })}
                                    placeholder="Additional notes..."
                                    rows={2}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeProviderModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingProvider ? 'Save Changes' : 'Add Provider'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Appointment Modal */}
            {showAppointmentModal && (
                <div className="modal-overlay" onClick={closeAppointmentModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Schedule Appointment</h2>
                            <button className="modal-close" onClick={closeAppointmentModal}>
                                <FiX />
                            </button>
                        </div>
                        <form onSubmit={handleAppointmentSubmit}>
                            <div className="form-group">
                                <label>Provider *</label>
                                {providers.length > 0 ? (
                                    <select
                                        value={appointmentForm.providerId}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                            const provider = providers.find((p: HealthcareProvider) => p.id === e.target.value);
                                            setAppointmentForm({
                                                ...appointmentForm,
                                                providerId: e.target.value,
                                                providerName: provider?.name || ''
                                            });
                                        }}
                                        required
                                    >
                                        <option value="">Select a provider</option>
                                        {providers.map((p: HealthcareProvider) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={appointmentForm.providerName}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setAppointmentForm({ ...appointmentForm, providerName: e.target.value })}
                                        placeholder="Provider name"
                                        required
                                    />
                                )}
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date *</label>
                                    <input
                                        type="date"
                                        value={appointmentForm.date}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Time *</label>
                                    <input
                                        type="time"
                                        value={appointmentForm.time}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Purpose *</label>
                                <input
                                    type="text"
                                    value={appointmentForm.purpose}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setAppointmentForm({ ...appointmentForm, purpose: e.target.value })}
                                    placeholder="Annual checkup, Follow-up, etc."
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Notes</label>
                                <textarea
                                    value={appointmentForm.notes}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                                    placeholder="Additional notes..."
                                    rows={2}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeAppointmentModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    <FiCalendar />
                                    Schedule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthcareProviders;
