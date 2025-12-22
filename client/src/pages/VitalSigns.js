import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiHeart, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { vitalSignsAPI } from '../services/api';
import './Pages.css';

const vitalTypes = [
  { value: 'Blood Pressure', unit: 'mmHg', placeholder: '120/80' },
  { value: 'Heart Rate', unit: 'bpm', placeholder: '72' },
  { value: 'Temperature', unit: '°F', placeholder: '98.6' },
  { value: 'Blood Sugar', unit: 'mg/dL', placeholder: '100' },
  { value: 'Oxygen Saturation', unit: '%', placeholder: '98' },
  { value: 'Weight', unit: 'kg', placeholder: '70' },
  { value: 'Respiratory Rate', unit: 'breaths/min', placeholder: '16' }
];

const VitalSigns = () => {
  const [vitalSigns, setVitalSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Blood Pressure',
    value: ''
  });

  useEffect(() => {
    fetchVitalSigns();
  }, []);

  const fetchVitalSigns = async () => {
    try {
      const response = await vitalSignsAPI.get();
      setVitalSigns(response.data.vitalSigns || []);
    } catch (error) {
      console.error('Failed to fetch vital signs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const selectedType = vitalTypes.find(v => v.value === formData.type);
    const valueWithUnit = `${formData.value} ${selectedType?.unit || ''}`.trim();
    
    try {
      await vitalSignsAPI.add({
        type: formData.type,
        value: valueWithUnit
      });
      
      toast.success('Vital sign recorded!');
      fetchVitalSigns();
      closeModal();
    } catch (error) {
      toast.error('Failed to record vital sign');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vital sign record?')) return;
    
    try {
      await vitalSignsAPI.delete(id);
      toast.success('Vital sign deleted!');
      fetchVitalSigns();
    } catch (error) {
      toast.error('Failed to delete vital sign');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ type: 'Blood Pressure', value: '' });
  };

  const getLatestByType = () => {
    const latest = {};
    vitalSigns.forEach(v => {
      if (!latest[v.type]) {
        latest[v.type] = v;
      }
    });
    return latest;
  };

  const latestVitals = getLatestByType();
  const selectedVitalType = vitalTypes.find(v => v.value === formData.type);

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
            <FiHeart className="page-icon" />
            Vital Signs
          </h1>
          <p>Monitor and track your health vitals</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus />
          Record Vital
        </button>
      </header>

      {/* Latest Vitals Grid */}
      <div className="vitals-overview">
        <h3>Latest Readings</h3>
        <div className="vitals-cards">
          {vitalTypes.map(vitalType => {
            const latest = latestVitals[vitalType.value];
            return (
              <div key={vitalType.value} className={`vital-card ${latest ? 'has-data' : ''}`}>
                <span className="vital-label">{vitalType.value}</span>
                <span className="vital-reading">
                  {latest ? latest.value : '—'}
                </span>
                {latest && (
                  <span className="vital-date">
                    {new Date(latest.recordedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* History */}
      <div className="vitals-history">
        <h3>History</h3>
        {vitalSigns.length === 0 ? (
          <div className="empty-card small">
            <div className="empty-icon">❤️</div>
            <h4>No Vital Signs Recorded</h4>
            <p>Start tracking your health vitals</p>
          </div>
        ) : (
          <div className="vitals-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Recorded</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {vitalSigns.map((vital) => (
                  <tr key={vital.id}>
                    <td>
                      <div className="vital-type-cell">
                        <FiHeart className="vital-icon" />
                        <span>{vital.type}</span>
                      </div>
                    </td>
                    <td>
                      <span className="vital-value-cell">{vital.value}</span>
                    </td>
                    <td>
                      {new Date(vital.recordedAt).toLocaleString()}
                    </td>
                    <td>
                      <button 
                        className="icon-btn danger small"
                        onClick={() => handleDelete(vital.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Record Vital Sign</h2>
              <button className="modal-close" onClick={closeModal}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Vital Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value, value: '' })}
                  required
                >
                  {vitalTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.value}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Value ({selectedVitalType?.unit})</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder={selectedVitalType?.placeholder}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <FiPlus />
                  Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalSigns;

