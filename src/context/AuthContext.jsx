import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // ✅ Register User
  // ✅ Register User (without auto-login)
const register = async ({ name, email, password, role }) => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message };
    }

    // ❌ Don't set user/token here
    // setUser(data.user);
    // setToken(data.token);
    // localStorage.setItem("user", JSON.stringify(data.user));
    // localStorage.setItem("token", data.token);

    return { success: true, role: data.user.role };
  } catch (err) {
    console.error("Register error:", err);
    return { success: false, message: "Something went wrong" };
  }
};


  // ✅ Login User
  const login = async ({ email, password }) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Login failed" };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      return { success: true, role: data.user.role };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Something went wrong" };
    }
  };

  // ✅ Logout User
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // ✅ Auto logout if token removed/expired
  useEffect(() => {
    if (!token) {
      setUser(null);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
