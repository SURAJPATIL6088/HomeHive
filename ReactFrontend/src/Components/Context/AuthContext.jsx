import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getToken, getUserProfile } from "../Services/UserService";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setRole(decoded.authorities?.[0]);
          setEmail(decoded.sub);
          setIsAuthenticated(true);
        
          try {
            const profileResponse = await getUserProfile();
            setUser(profileResponse.data);
          } catch (profileError) {
            console.error("Failed to fetch user profile:", profileError);
          }
          
          console.log("authenticated..", decoded.authorities?.[0], true);
        } catch (error) {
          console.error("Token decoding failed", error);
          setIsAuthenticated(false);
          setRole(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated,
      role,
      setRole,
      email,
      setEmail,
      user,
      setUser,
      loading,
      setLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;