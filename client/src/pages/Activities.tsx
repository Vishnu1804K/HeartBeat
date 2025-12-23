import React, { useState, useEffect, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { FiActivity, FiPlus, FiClock, FiZap, FiX } from 'react-icons/fi';
import { activitiesAPI } from '../services/api';
import { Activity } from '../types';
import './Pages.css';

const activityTypes: string[] = [
  'Running', 'Walking', 'Cycling', 'Swimming', 'Gym Workout', 
  'Yoga', 'HIIT', 'Strength Training', 'Dancing', 'Sports', 'Other'
];

interface ActivityFormData {
  type: string;
  duration: string;
  distance: string;
  caloriesBurned: string;
  intensity: 'low' | 'medium' | 'high';
}

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<ActivityFormData>({
    type: 'Running',
    duration: '',
    distance: '',
    caloriesBurned: '',
    intensity: 'medium'
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async (): Promise<void> => {
    try {
      const response = await activitiesAPI.get();
      setActivities(response.data.activities || []);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    try {
      await activitiesAPI.log({
        type: formData.type,
        duration: parseInt(formData.duration),
        distance: formData.distance ? parseFloat(formData.distance) : null,
        caloriesBurned: parseInt(formData.caloriesBurned) || 0,
        intensity: formData.intensity
      });
      
      toast.success('Activity logged!');
      fetchActivities();
      closeModal();
    } catch (error) {
      toast.error('Failed to log activity');
    }
  };

  const closeModal = (): void => {
    setShowModal(false);
    setFormData({
      type: 'Running',
      duration: '',
      distance: '',
      caloriesBurned: '',
      intensity: 'medium'
    });
  };

  const getTotalStats = (): { totalActivities: number; totalDuration: number; totalCalories: number; totalDistance: number } => {
    return {
      totalActivities: activities.length,
      totalDuration: activities.reduce((sum, a) => sum + (a.duration || 0), 0),
      totalCalories: activities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0),
      totalDistance: activities.reduce((sum, a) => sum + (a.distance || 0), 0)
    };
  };

  const stats = getTotalStats();

  const getIntensityColor = (intensity: string): string => {
    switch (intensity) {
      case 'high': return 'var(--accent-rose)';
      case 'medium': return 'var(--accent-coral)';
      case 'low': return 'var(--primary-light)';
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
            <FiActivity className="page-icon" />
            Activities
          </h1>
          <p>Track your workouts and physical activities</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus />
          Log Activity
        </button>
      </header>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="summary-card">
          <FiActivity className="summary-icon" />
          <div className="summary-content">
            <span className="summary-value">{stats.totalActivities}</span>
            <span className="summary-label">Total Workouts</span>
          </div>
        </div>
        <div className="summary-card">
          <FiClock className="summary-icon" />
          <div className="summary-content">
            <span className="summary-value">{stats.totalDuration}</span>
            <span className="summary-label">Minutes Active</span>
          </div>
        </div>
        <div className="summary-card">
          <FiZap className="summary-icon" />
          <div className="summary-content">
            <span className="summary-value">{stats.totalCalories}</span>
            <span className="summary-label">Calories Burned</span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon-emoji">🏃</span>
          <div className="summary-content">
            <span className="summary-value">{stats.totalDistance.toFixed(1)}</span>
            <span className="summary-label">Km Covered</span>
          </div>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="empty-card">
          <div className="empty-icon">🏋️</div>
          <h3>No Activities Logged</h3>
          <p>Start tracking your workouts to see your progress</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus />
            Log Your First Activity
          </button>
        </div>
      ) : (
        <div className="activities-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Duration</th>
                <th>Distance</th>
                <th>Calories</th>
                <th>Intensity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index}>
                  <td>
                    <div className="activity-cell">
                      <FiActivity className="activity-icon" />
                      <span>{activity.type}</span>
                    </div>
                  </td>
                  <td>{activity.duration} min</td>
                  <td>{activity.distance ? `${activity.distance} km` : '—'}</td>
                  <td>{activity.caloriesBurned} cal</td>
                  <td>
                    <span 
                      className="intensity-badge" 
                      style={{ color: getIntensityColor(activity.intensity) }}
                    >
                      {activity.intensity}
                    </span>
                  </td>
                  <td>{new Date(activity.recordedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Log Activity</h2>
              <button className="modal-close" onClick={closeModal}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Activity Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  {activityTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="30"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Distance (km)</label>
                  <input
                    type="number"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    placeholder="5.0"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Calories Burned</label>
                  <input
                    type="number"
                    value={formData.caloriesBurned}
                    onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
                    placeholder="200"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Intensity</label>
                  <select
                    value={formData.intensity}
                    onChange={(e) => setFormData({ ...formData, intensity: e.target.value as 'low' | 'medium' | 'high' })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <FiPlus />
                  Log Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;

