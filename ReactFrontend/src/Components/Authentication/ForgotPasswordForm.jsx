import { useState } from 'react'
import PasswordStrengthIndicator from './PasswordStrengthIndicator'
import './ForgotPasswordForm.css'

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return 'Email is required'
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return ''
  }

  // Password validation
  const validatePassword = (password) => {
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters long'
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter'
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter'
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number'
    if (!/(?=.*[@$!%*?&])/.test(password)) return 'Password must contain at least one special character (@$!%*?&)'
    return ''
  }

  // Confirm password validation
  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password'
    if (confirmPassword !== formData.newPassword) return 'Passwords do not match'
    return ''
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.newPassword)
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword)
    const newErrors = {}
    if (emailError) newErrors.email = emailError
    if (passwordError) newErrors.newPassword = passwordError
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200))
      alert('Password reset successful!')
      setFormData({ email: '', newPassword: '', confirmPassword: '' })
      setErrors({})
      if (onBackToLogin) onBackToLogin()
    } catch (error) {
      alert('Password reset failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <div className="forgot-header">
          <h1>Reset Password</h1>
          <p>Enter your email and new password</p>
        </div>
        <form onSubmit={handleSubmit} className="forgot-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={errors.newPassword ? 'input-error' : ''}
              placeholder="Create a new password"
              disabled={isSubmitting}
            />
            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
            <PasswordStrengthIndicator password={formData.newPassword} />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'input-error' : ''}
              placeholder="Confirm your new password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          <div className="form-options">
            <button type="button" className="login-link-button" onClick={onBackToLogin} disabled={isSubmitting}>
              Back to Login
            </button>
          </div>
          <button type="submit" className="signup-button" disabled={isSubmitting}>
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordForm 