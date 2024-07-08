import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Fetch user details here if needed
    }
  }, []);

  const login = async (email, password) => {
    const response = await axios.post("http://localhost:5000/api/login", {
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.token}`;
    setUser(response.data.user);
  };

  const register = async (email, password) => {
    await axios.post("http://localhost:5000/api/register", { email, password });
    // Optionally login user after registration
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
