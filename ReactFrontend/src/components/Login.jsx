import React from 'react';

const Login = () => (
  <form>
    <h2>Login</h2>
    <input type="email" placeholder="Email" required />
    <input type="password" placeholder="Password" required />
    <button type="submit">Login</button>
  </form>
);

export default Login;
