import './PasswordStrengthIndicator.css'

const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' }
    
    let score = 0
    let feedback = []
    
    // Length check
    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push('At least 8 characters')
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push('One lowercase letter')
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push('One uppercase letter')
    }
    
    // Number check
    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push('One number')
    }
    
    // Special character check
    if (/[@$!%*?&]/.test(password)) {
      score += 1
    } else {
      feedback.push('One special character (@$!%*?&)')
    }
    
    // Determine strength level
    let label, color
    if (score === 0) {
      label = ''
      color = ''
    } else if (score <= 2) {
      label = 'Weak'
      color = '#e74c3c'
    } else if (score <= 3) {
      label = 'Fair'
      color = '#f39c12'
    } else if (score <= 4) {
      label = 'Good'
      color = '#f1c40f'
    } else {
      label = 'Strong'
      color = '#27ae60'
    }
    
    return { score, label, color, feedback }
  }
  
  const strength = getPasswordStrength(password)
  
  if (!password) return null
  
  return (
    <div className="password-strength">
      <div className="strength-bar">
        <div 
          className="strength-fill" 
          style={{ 
            width: `${(strength.score / 5) * 100}%`,
            backgroundColor: strength.color 
          }}
        ></div>
      </div>
      <div className="strength-info">
        <span className="strength-label" style={{ color: strength.color }}>
          {strength.label}
        </span>
        {strength.feedback.length > 0 && (
          <div className="strength-feedback">
            <small>Missing: {strength.feedback.join(', ')}</small>
          </div>
        )}
      </div>
    </div>
  )
}

export default PasswordStrengthIndicator 