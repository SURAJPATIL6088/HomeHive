import { useState } from 'react'
import PasswordStrengthIndicator from './PasswordStrengthIndicator'
import './SignupForm.css'

const SignupForm = ({ onSwitchToLogin, onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    flatNumber: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // First name validation
  const validateFirstName = (firstName) => {
    if (!firstName.trim()) {
      return 'First name is required'
    }
    if (firstName.trim().length < 2) {
      return 'First name must be at least 2 characters long'
    }
    if (!/^[a-zA-Z\s]+$/.test(firstName.trim())) {
      return 'First name can only contain letters and spaces'
    }
    return ''
  }

  // Last name validation
  const validateLastName = (lastName) => {
    if (!lastName.trim()) {
      return 'Last name is required'
    }
    if (lastName.trim().length < 2) {
      return 'Last name must be at least 2 characters long'
    }
    if (!/^[a-zA-Z\s]+$/.test(lastName.trim())) {
      return 'Last name can only contain letters and spaces'
    }
    return ''
  }

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      return 'Email is required'
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    return ''
  }

  // Flat number validation
  const validateFlatNumber = (flatNumber) => {
    if (!flatNumber.trim()) {
      return 'Flat number is required'
    }
    if (flatNumber.trim().length < 1) {
      return 'Flat number cannot be empty'
    }
    // Allow alphanumeric characters, spaces, and common symbols like -, /, #
    if (!/^[a-zA-Z0-9\s\-\/#]+$/.test(flatNumber.trim())) {
      return 'Flat number can only contain letters, numbers, spaces, -, /, and #'
    }
    return ''
  }

  // Mobile number validation
  const validateMobileNumber = (mobileNumber) => {
    if (!mobileNumber.trim()) {
      return 'Mobile number is required'
    }
    // Remove all non-digit characters for validation
    const cleanNumber = mobileNumber.replace(/\D/g, '')
    if (cleanNumber.length < 10) {
      return 'Mobile number must be at least 10 digits'
    }
    if (cleanNumber.length > 15) {
      return 'Mobile number cannot exceed 15 digits'
    }
    return ''
  }

  // Password validation
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required'
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number'
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return 'Password must contain at least one special character (@$!%*?&)'
    }
    return ''
  }

  // Confirm password validation
  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) {
      return 'Please confirm your password'
    }
    if (confirmPassword !== formData.password) {
      return 'Passwords do not match'
    }
    return ''
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const firstNameError = validateFirstName(formData.firstName)
    const lastNameError = validateLastName(formData.lastName)
    const emailError = validateEmail(formData.email)
    const flatNumberError = validateFlatNumber(formData.flatNumber)
    const mobileNumberError = validateMobileNumber(formData.mobileNumber)
    const passwordError = validatePassword(formData.password)
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword)
    
    const newErrors = {}
    if (firstNameError) newErrors.firstName = firstNameError
    if (lastNameError) newErrors.lastName = lastNameError
    if (emailError) newErrors.email = emailError
    if (flatNumberError) newErrors.flatNumber = flatNumberError
    if (mobileNumberError) newErrors.mobileNumber = mobileNumberError
    if (passwordError) newErrors.password = passwordError
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Success - you would typically handle user registration here
      console.log('Signup successful:', formData)
      
      // Call the success callback to show success message and redirect
      if (onSignupSuccess) {
        onSignupSuccess()
      }
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        flatNumber: '',
        mobileNumber: '',
        password: '',
        confirmPassword: ''
      })
      setErrors({})
      
    } catch (error) {
      console.error('Signup failed:', error)
      alert('Signup failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Join us today! Please fill in your details below</p>
        </div>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'input-error' : ''}
              placeholder="Enter your first name"
              disabled={isSubmitting}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'input-error' : ''}
              placeholder="Enter your last name"
              disabled={isSubmitting}
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              placeholder="Enter your email address"
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="flatNumber">Flat Number</label>
            <input
              type="text"
              id="flatNumber"
              name="flatNumber"
              value={formData.flatNumber}
              onChange={handleChange}
              className={errors.flatNumber ? 'input-error' : ''}
              placeholder="e.g., A-101, Flat 2B, #15"
              disabled={isSubmitting}
            />
            {errors.flatNumber && <span className="error-message">{errors.flatNumber}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className={errors.mobileNumber ? 'input-error' : ''}
              placeholder="Enter your mobile number"
              disabled={isSubmitting}
            />
            {errors.mobileNumber && <span className="error-message">{errors.mobileNumber}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
              placeholder="Create a strong password"
              disabled={isSubmitting}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            <PasswordStrengthIndicator password={formData.password} />
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
              placeholder="Confirm your password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          
          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" required />
              <span className="checkmark"></span>
              I agree to the <a href="#" className="terms-link">Terms & Conditions</a>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="signup-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="signup-footer">
          <p>
            Already have an account? <button type="button" className="login-link-button" onClick={onSwitchToLogin}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupForm 