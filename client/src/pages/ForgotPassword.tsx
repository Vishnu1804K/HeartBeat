import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiArrowLeft, FiSend } from 'react-icons/fi';
import { authAPI } from '../services/api';
import './Auth.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

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
              <div className="header-icon">🔑</div>
              <h2>Forgot Password?</h2>
              <p>No worries! Enter your email and we'll send you a reset link.</p>
            </div>

            {sent ? (
              <div className="success-message">
                <div className="success-icon">✉️</div>
                <h3>Check Your Email</h3>
                <p>We've sent a password reset link to <strong>{email}</strong></p>
                <p className="hint">Didn't receive the email? Check your spam folder or try again.</p>
                <button className="auth-btn secondary" onClick={() => setSent(false)}>
                  Try Again
                </button>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <FiMail className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? (
                    <span className="btn-loader"></span>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <FiSend />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

