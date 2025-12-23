import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLock, FiArrowLeft, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { authAPI } from '../services/api';
import './Auth.css';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [validating, setValidating] = useState<boolean>(true);
  const [tokenValid, setTokenValid] = useState<boolean>(false);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async (): Promise<void> => {
    if (!token) {
      setTokenValid(false);
      setValidating(false);
      return;
    }

    try {
      const response = await authAPI.verifyResetToken(token);
      setTokenValid(response.data.valid);
    } catch (error) {
      setTokenValid(false);
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(token!, { password });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="auth-page">
        <div className="auth-container compact">
          <div className="auth-form-section full">
            <div className="auth-form-wrapper">
              <div className="loading-state">
                <div className="loader"></div>
                <p>Validating reset link...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="auth-page">
        <div className="auth-container compact">
          <div className="auth-form-section full">
            <div className="auth-form-wrapper">
              <div className="error-state">
                <FiAlertCircle className="error-icon" />
                <h2>Invalid or Expired Link</h2>
                <p>This password reset link is invalid or has expired. Please request a new one.</p>
                <Link to="/forgot-password" className="auth-btn">
                  Request New Link
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container compact">
        <div className="auth-form-section full">
          <div className="auth-form-wrapper">
            <Link to="/login" className="back-link">
              <FiArrowLeft />
              <span>Back to Login</span>
            </Link>

            <div className="auth-header">
              <div className="header-icon">🔐</div>
              <h2>Reset Password</h2>
              <p>Enter your new password below.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-loader"></span>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <FiCheck />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

