import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiTarget, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { fitnessAPI } from '../services/api';
import './Pages.css';

const FitnessGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    goal: '',
    target: 100,
    progress: 0
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fitnessAPI.getGoals();
      setGoals(response.data.goals || []);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingGoal !== null) {
        // Update all goals with the edited one
        const updatedGoals = goals.map((g, idx) => 
          idx === editingGoal 
            ? { goal: formData.goal, target: formData.target, progress: formData.progress }
            : { goal: g.goal, target: g.target, progress: g.progress }
        );
        await fitnessAPI.updateGoals({ goals: updatedGoals });
        toast.success('Goal updated!');
      } else {
        // Add new goal
        await fitnessAPI.setGoals({ 
          goals: [{ goal: formData.goal, target: formData.target, progress: 0 }] 
        });
        toast.success('Goal added!');
      }
      
      fetchGoals();
      closeModal();
    } catch (error) {
      toast.error('Failed to save goal');
    }
  };

  const handleProgressUpdate = async (index, newProgress) => {
    try {
      const updatedGoals = goals.map((g, idx) => ({
        goal: g.goal,
        target: g.target,
        progress: idx === index ? newProgress : g.progress
      }));
      
      await fitnessAPI.updateGoals({ goals: updatedGoals });
      setGoals(goals.map((g, idx) => 
        idx === index ? { ...g, progress: newProgress } : g
      ));
      toast.success('Progress updated!');
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      const updatedGoals = goals
        .filter((_, idx) => idx !== index)
        .map(g => ({ goal: g.goal, target: g.target, progress: g.progress }));
      
      if (updatedGoals.length === 0) {
        await fitnessAPI.deleteGoals();
      } else {
        await fitnessAPI.updateGoals({ goals: updatedGoals });
      }
      
      toast.success('Goal deleted!');
      fetchGoals();
    } catch (error) {
      toast.error('Failed to delete goal');
    }
  };

  const openEditModal = (index) => {
    const goal = goals[index];
    setFormData({
      goal: goal.goal,
      target: goal.target || 100,
      progress: goal.progress || 0
    });
    setEditingGoal(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGoal(null);
    setFormData({ goal: '', target: 100, progress: 0 });
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
            <FiTarget className="page-icon" />
            Fitness Goals
          </h1>
          <p>Set and track your health & fitness goals</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus />
          Add Goal
        </button>
      </header>

      {goals.length === 0 ? (
        <div className="empty-card">
          <div className="empty-icon">🎯</div>
          <h3>No Goals Yet</h3>
          <p>Start your journey by setting your first fitness goal</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus />
            Set Your First Goal
          </button>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map((goal, index) => {
            const percentage = Math.min((goal.progress / (goal.target || 100)) * 100, 100);
            const isComplete = percentage >= 100;
            
            return (
              <div key={index} className={`goal-card ${isComplete ? 'complete' : ''}`}>
                <div className="goal-card-header">
                  <h3>{goal.goal}</h3>
                  <div className="goal-actions">
                    <button className="icon-btn" onClick={() => openEditModal(index)}>
                      <FiEdit2 />
                    </button>
                    <button className="icon-btn danger" onClick={() => handleDelete(index)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                
                <div className="goal-progress-section">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span className="progress-percentage">{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="progress-bar large">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="progress-values">
                    <span>{goal.progress} / {goal.target || 100}</span>
                    {isComplete && <span className="complete-badge">✓ Complete</span>}
                  </div>
                </div>

                <div className="goal-card-footer">
                  <label>Update Progress:</label>
                  <div className="progress-input-group">
                    <input
                      type="number"
                      value={goal.progress}
                      onChange={(e) => {
                        const newProgress = parseInt(e.target.value) || 0;
                        setGoals(goals.map((g, idx) => 
                          idx === index ? { ...g, progress: newProgress } : g
                        ));
                      }}
                      min="0"
                      max={goal.target || 100}
                    />
                    <button 
                      className="btn-small"
                      onClick={() => handleProgressUpdate(index, goal.progress)}
                    >
                      <FiCheck />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingGoal !== null ? 'Edit Goal' : 'Add New Goal'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Goal Description</label>
                <input
                  type="text"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  placeholder="e.g., Walk 10,000 steps daily"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Target</label>
                  <input
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) || 100 })}
                    min="1"
                    required
                  />
                </div>
                {editingGoal !== null && (
                  <div className="form-group">
                    <label>Current Progress</label>
                    <input
                      type="number"
                      value={formData.progress}
                      onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                      min="0"
                      max={formData.target}
                    />
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingGoal !== null ? 'Save Changes' : 'Add Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessGoals;

