import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiTarget, 
  FiActivity, 
  FiHeart, 
  FiTrendingUp,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { fitnessAPI, activitiesAPI, vitalSignsAPI, recommendationsAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    goals: [],
    activities: [],
    vitalSigns: [],
    recommendations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [goalsRes, activitiesRes, vitalsRes, recsRes] = await Promise.all([
        fitnessAPI.getGoals(),
        activitiesAPI.get(),
        vitalSignsAPI.get(),
        recommendationsAPI.get()
      ]);

      setStats({
        goals: goalsRes.data.goals || [],
        activities: activitiesRes.data.activities || [],
        vitalSigns: vitalsRes.data.vitalSigns || [],
        recommendations: recsRes.data.recommendations || []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const calculateTotalCalories = () => {
    return stats.activities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0);
  };

  const getLatestVitalSigns = () => {
    const grouped = {};
    stats.vitalSigns.forEach(v => {
      if (!grouped[v.type]) {
        grouped[v.type] = v;
      }
    });
    return Object.values(grouped).slice(0, 3);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading your health data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="greeting">
          <h1>{getGreeting()}, {user?.name || 'there'}! 👋</h1>
          <p>Here's an overview of your health journey</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card gradient-teal">
          <div className="stat-icon">
            <FiTarget />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.goals.length}</span>
            <span className="stat-label">Active Goals</span>
          </div>
          <Link to="/fitness-goals" className="stat-link">
            <FiArrowRight />
          </Link>
        </div>

        <div className="stat-card gradient-orange">
          <div className="stat-icon">
            <FiActivity />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.activities.length}</span>
            <span className="stat-label">Workouts Logged</span>
          </div>
          <Link to="/activities" className="stat-link">
            <FiArrowRight />
          </Link>
        </div>

        <div className="stat-card gradient-rose">
          <div className="stat-icon">
            <FiHeart />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.vitalSigns.length}</span>
            <span className="stat-label">Vitals Recorded</span>
          </div>
          <Link to="/vital-signs" className="stat-link">
            <FiArrowRight />
          </Link>
        </div>

        <div className="stat-card gradient-violet">
          <div className="stat-icon">
            <FiTrendingUp />
          </div>
          <div className="stat-content">
            <span className="stat-value">{calculateTotalCalories()}</span>
            <span className="stat-label">Calories Burned</span>
          </div>
          <Link to="/activities" className="stat-link">
            <FiArrowRight />
          </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Goals Progress */}
        <section className="dashboard-card goals-section">
          <div className="card-header">
            <h2>
              <FiTarget className="header-icon" />
              Fitness Goals
            </h2>
            <Link to="/fitness-goals" className="view-all">View All</Link>
          </div>
          <div className="card-content">
            {stats.goals.length === 0 ? (
              <div className="empty-state">
                <p>No goals set yet</p>
                <Link to="/fitness-goals" className="action-link">Set Your First Goal</Link>
              </div>
            ) : (
              <div className="goals-list">
                {stats.goals.slice(0, 3).map((goal, index) => (
                  <div key={index} className="goal-item">
                    <div className="goal-info">
                      <span className="goal-name">{goal.goal}</span>
                      <span className="goal-progress-text">
                        {goal.progress} / {goal.target || 100}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min((goal.progress / (goal.target || 100)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Latest Vitals */}
        <section className="dashboard-card vitals-section">
          <div className="card-header">
            <h2>
              <FiHeart className="header-icon" />
              Latest Vital Signs
            </h2>
            <Link to="/vital-signs" className="view-all">View All</Link>
          </div>
          <div className="card-content">
            {stats.vitalSigns.length === 0 ? (
              <div className="empty-state">
                <p>No vitals recorded</p>
                <Link to="/vital-signs" className="action-link">Record Vitals</Link>
              </div>
            ) : (
              <div className="vitals-grid">
                {getLatestVitalSigns().map((vital, index) => (
                  <div key={index} className="vital-item">
                    <span className="vital-type">{vital.type}</span>
                    <span className="vital-value">{vital.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Recommendations */}
        <section className="dashboard-card recommendations-section">
          <div className="card-header">
            <h2>
              <FiAlertCircle className="header-icon" />
              Health Recommendations
            </h2>
          </div>
          <div className="card-content">
            {stats.recommendations.length === 0 ? (
              <div className="empty-state">
                <p>No recommendations available</p>
              </div>
            ) : (
              <div className="recommendations-list">
                {stats.recommendations.slice(0, 4).map((rec, index) => (
                  <div key={index} className={`rec-item priority-${rec.priority}`}>
                    <FiCheckCircle className="rec-icon" />
                    <div className="rec-content">
                      <span className="rec-title">{rec.title}</span>
                      <span className="rec-desc">{rec.description}</span>
                    </div>
                    <span className={`rec-badge ${rec.priority}`}>{rec.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Recent Activities */}
        <section className="dashboard-card activities-section">
          <div className="card-header">
            <h2>
              <FiActivity className="header-icon" />
              Recent Activities
            </h2>
            <Link to="/activities" className="view-all">View All</Link>
          </div>
          <div className="card-content">
            {stats.activities.length === 0 ? (
              <div className="empty-state">
                <p>No activities logged</p>
                <Link to="/activities" className="action-link">Log Activity</Link>
              </div>
            ) : (
              <div className="activities-list">
                {stats.activities.slice(0, 4).map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon-wrapper">
                      <FiActivity />
                    </div>
                    <div className="activity-info">
                      <span className="activity-type">{activity.type}</span>
                      <span className="activity-meta">
                        {activity.duration} min • {activity.caloriesBurned} cal
                      </span>
                    </div>
                    <span className="activity-date">
                      {new Date(activity.recordedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

