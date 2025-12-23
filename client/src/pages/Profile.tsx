import React, { useState, useEffect, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { FiUser, FiSave, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import './Pages.css';

interface ProfileFormData {
  name: string;
  email: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  medicalConditions: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    medicalConditions: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age?.toString() || '',
        gender: user.gender || '',
        height: user.height?.toString() || '',
        weight: user.weight?.toString() || '',
        medicalConditions: user.medicalConditions?.join(', ') || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        name: formData.name,
        email: formData.email,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        medicalConditions: formData.medicalConditions
          ? formData.medicalConditions.split(',').map(c => c.trim()).filter(c => c)
          : []
      };

      await profileAPI.update(data);
      updateUser(data);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = (): string | null => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const bmi = parseFloat(formData.weight) / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number): { label: string; color: string } => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'var(--accent-sky)' };
    if (bmi < 25) return { label: 'Normal', color: 'var(--primary-light)' };
    if (bmi < 30) return { label: 'Overweight', color: 'var(--accent-coral)' };
    return { label: 'Obese', color: 'var(--accent-rose)' };
  };

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1>
            <FiUser className="page-icon" />
            My Profile
          </h1>
          <p>Manage your personal health information</p>
        </div>
        {!editing && (
          <button className="btn-primary" onClick={() => setEditing(true)}>
            <FiEdit2 />
            Edit Profile
          </button>
        )}
      </header>

      <div className="profile-grid">
        <form className="card profile-form" onSubmit={handleSubmit}>
          <h3>Personal Information</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age"
                min="1"
                max="120"
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!editing}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Height in cm"
                min="50"
                max="300"
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Weight in kg"
                min="20"
                max="500"
                step="0.1"
                disabled={!editing}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Medical Conditions</label>
            <textarea
              name="medicalConditions"
              value={formData.medicalConditions}
              onChange={handleChange}
              placeholder="Enter conditions separated by commas (e.g., Diabetes, Hypertension)"
              rows={3}
              disabled={!editing}
            />
          </div>

          {editing && (
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : (
                  <>
                    <FiSave />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>

        <div className="profile-sidebar">
          <div className="card bmi-card">
            <h3>Body Mass Index</h3>
            {bmi ? (
              <div className="bmi-display">
                <div className="bmi-value" style={{ color: bmiInfo?.color }}>
                  {bmi}
                </div>
                <div className="bmi-label" style={{ color: bmiInfo?.color }}>
                  {bmiInfo?.label}
                </div>
                <div className="bmi-scale">
                  <div className="scale-bar">
                    <div 
                      className="scale-indicator" 
                      style={{ left: `${Math.min(Math.max((parseFloat(bmi) - 15) / 25 * 100, 0), 100)}%` }}
                    />
                  </div>
                  <div className="scale-labels">
                    <span>15</span>
                    <span>40</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="empty-text">Add height and weight to calculate BMI</p>
            )}
          </div>

          <div className="card stats-card">
            <h3>Quick Stats</h3>
            <div className="stats-list">
              <div className="stat-row">
                <span className="stat-label">Height</span>
                <span className="stat-value">{formData.height ? `${formData.height} cm` : '—'}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Weight</span>
                <span className="stat-value">{formData.weight ? `${formData.weight} kg` : '—'}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Age</span>
                <span className="stat-value">{formData.age ? `${formData.age} years` : '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

