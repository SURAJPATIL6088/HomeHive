import React from 'react';

const Register = () => (
  <form>
    <h2>Register</h2>
    <input type="text" placeholder="Name" required />
    <input type="email" placeholder="Email" required />
    <input type="password" placeholder="Password" required />
    <button type="submit">Create Account</button>
  </form>
);

export default Register;
