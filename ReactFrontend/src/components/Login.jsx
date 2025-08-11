import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";
import "./Login.css";

import { loginUser, storeToken, getUserRole } from "./Services/UserService";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const { setIsAuthenticated, setRole } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); 
    try { 
      const response = await loginUser(formData);
      
      if (response.status === 201 && response.data.jwt) {
        const token = response.data.jwt;
        storeToken(token);
        const userRole = getUserRole();

        setIsAuthenticated(true);
        setRole(userRole);

        if (userRole === "ROLE_ADMIN") {
          navigate("/admin/");
        } else if (userRole === "ROLE_ACCOUNTANT") {
          navigate("/accountant/");
        } else {
          navigate("/resident/");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response) {
        errorMessage = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
       
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div className="container-fluid login-container d-flex align-items-center justify-content-center p-4">
        <div className="bg-image"></div>
        
        <div className="bg-pattern">
          <div className="bg-orb bg-orb-1"></div>
          <div className="bg-orb bg-orb-2"></div>
          <div className="bg-orb bg-orb-3"></div>
        </div>

        <div className="content-wrapper w-100">
          <div className="row w-100 justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
              <div className="login-card p-4 p-md-5">
                  <div>
                    <button className="border-0 bg-transparent" onClick={()=>{navigate("/dashboard")}}><i class="bi bi-arrow-left"></i></button>
                  </div>
                <div className="text-center mb-4">
                  <h2 className="h3 font-weight-bold text-dark mb-2">Welcome Back</h2>
                  <p className="text-muted mb-0">Sign in to continue to your account</p>
                </div>

                <form onSubmit={handleLogin}>
                  {error && (
                    <div className="error-alert">
                      <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label font-weight-medium text-dark">
                      Email Address
                    </label>
                    <div className="input-group-custom">
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control form-control-custom"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label font-weight-medium text-dark">
                      Password
                    </label>
                    <div className="input-group-custom">
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control form-control-custom"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="eye-button"
                      >
                        {showPassword ? (
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-gradient w-100 d-flex align-items-center justify-content-center"
                  >
                    {loading ? (
                      <>
                        <div className="spinner me-2"></div>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <svg className="ms-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  <div className="divider">
                    <span>New here?</span>
                  </div>

                  <hr className="divider-line" />

                  <div className="text-center">
                    <Link to="/register" className="link-custom d-inline-flex align-items-center">
                      <span>Create an account</span>
                      <svg className="ms-1" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </form>
              </div>

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

export default Login;