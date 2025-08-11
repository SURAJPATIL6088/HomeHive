import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!feedback.trim()) {
      setError('Please provide your feedback.');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Thank you for your feedback! We appreciate your input.');
      setName('');
      setFeedback('');
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .feedback-container {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        
        .bg-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('./society9.jpg'); 
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.4;
          z-index: 1;
        }
        
        .bg-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('./society2.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 1;
        }
        
        .bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.06;
          pointer-events: none;
          z-index: 2;
        }
        
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.7;
        }
        
        .bg-orb-1 {
          top: 10%;
          left: 10%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #3b82f6, #1d4ed8);
          animation: float 6s ease-in-out infinite;
        }
        
        .bg-orb-2 {
          top: 10%;
          right: 10%;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, #6366f1, #4338ca);
          animation: float 8s ease-in-out infinite reverse;
        }
        
        .bg-orb-3 {
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, #8b5cf6, #7c3aed);
          animation: float 10s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        /* Content wrapper to ensure it's above background */
        .content-wrapper {
          position: relative;
          z-index: 10;
        }
        
        .feedback-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
        }
        
        .input-group-custom {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          left: 15px;
          top: 18px;
          color: #9ca3af;
          width: 20px;
          height: 20px;
          pointer-events: none;
          z-index: 10;
        }
        
        .textarea-icon {
          position: absolute;
          left: 15px;
          top: 18px;
          color: #9ca3af;
          width: 20px;
          height: 20px;
          pointer-events: none;
          z-index: 10;
        }
        
        .form-control-custom {
          padding-left: 45px !important;
          padding-right: 15px !important;
          height: 50px !important;
          background: rgba(249, 250, 251, 0.7) !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 16px !important;
          transition: all 0.2s ease !important;
          font-size: 14px !important;
        }
        
        .textarea-control-custom {
          padding-left: 45px !important;
          padding-right: 15px !important;
          padding-top: 15px !important;
          background: rgba(249, 250, 251, 0.7) !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 16px !important;
          transition: all 0.2s ease !important;
          font-size: 14px !important;
          resize: vertical;
          min-height: 120px !important;
        }
        
        .form-control-custom:focus,
        .textarea-control-custom:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          outline: none !important;
          background: rgba(255, 255, 255, 0.9) !important;
        }
        
        .btn-gradient {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%) !important;
          border: none !important;
          border-radius: 16px !important;
          color: white !important;
          font-weight: 600 !important;
          height: 50px !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3) !important;
        }
        
        .btn-gradient:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.4) !important;
          color: white !important;
        }
        
        .btn-gradient:disabled {
          opacity: 0.6 !important;
          transform: none !important;
          cursor: not-allowed !important;
        }
        
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-alert {
          background: rgba(254, 242, 242, 0.9);
          border: 1px solid rgba(220, 53, 69, 0.2);
          border-radius: 12px;
          padding: 12px 16px;
          color: #dc3545;
          font-size: 14px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }
        
        .success-alert {
          background: rgba(240, 253, 244, 0.9);
          border: 1px solid rgba(22, 163, 74, 0.2);
          border-radius: 12px;
          padding: 12px 16px;
          color: #16a34a;
          font-size: 14px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }
        
        .alert-icon {
          width: 18px;
          height: 18px;
          margin-right: 10px;
          flex-shrink: 0;
        }
        
        @media (max-width: 768px) {
          .bg-image {
            opacity: 0.15;
          }
          .bg-image-overlay {
            background-image: url('./society2.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
          .bg-orb {
            opacity: 0.5;
          }
        }
      `}</style>

      <div className="container-fluid feedback-container d-flex align-items-center justify-content-center p-4">
        {/* Background Image - Choose one of the methods below */}
        
        {/* Method 1: Simple transparent background image */}
        <div className="bg-image"></div>
        
        {/* Method 2: Background image with gradient overlay (comment out Method 1 if using this) */}
        {/* <div className="bg-image-overlay"></div> */}

        {/* Background Pattern with floating orbs */}
        <div className="bg-pattern">
          <div className="bg-orb bg-orb-1"></div>
          <div className="bg-orb bg-orb-2"></div>
          <div className="bg-orb bg-orb-3"></div>
        </div>

        {/* Content Wrapper */}
        <div className="content-wrapper w-100">
          <div className="row w-100 justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
              <div className="feedback-card p-4 p-md-5">
                <div>
                  <button className="border-0 bg-transparent" onClick={()=>{navigate("/dashboard")}}><i class="bi bi-arrow-left"></i></button>
                </div>
                <div className="text-center mb-4">
                  <h2 className="h3 font-weight-bold text-dark mb-2">Share Your Feedback</h2>
                  <p className="text-muted mb-0">We value your thoughts and suggestions</p>
                </div>

                {/* Error and Success Messages */}
                {error && (
                  <div className="error-alert">
                    <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}
                {success && (
                  <div className="success-alert">
                    <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Name Field (Optional) */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label font-weight-medium text-dark">
                      Name (Optional)
                    </label>
                    <div className="input-group-custom">
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="form-control form-control-custom"
                        placeholder="Your name (optional)"
                      />
                    </div>
                  </div>

                  {/* Feedback Field */}
                  <div className="mb-4">
                    <label htmlFor="feedback" className="form-label font-weight-medium text-dark">
                      Your Feedback
                    </label>
                    <div className="input-group-custom">
                      <svg className="textarea-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <textarea
                        id="feedback"
                        name="feedback"
                        value={feedback}
                        onChange={e => setFeedback(e.target.value)}
                        className="form-control textarea-control-custom"
                        placeholder="Share your thoughts, suggestions, or report issues..."
                        rows="5"
                        required
                      />
                    </div>
                    <small className="text-muted mt-1 d-block" style={{fontSize: '12px'}}>
                      Please share your honest feedback to help us improve
                    </small>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-gradient w-100 d-flex align-items-center justify-content-center"
                  >
                    {loading ? (
                      <>
                        <div className="spinner me-2"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Feedback</span>
                        <svg className="ms-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Footer */}
              <div className="text-center mt-4">
                <small className="text-muted">© 2025 Effortless society Application.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feedback;