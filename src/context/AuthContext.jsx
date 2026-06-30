import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // cek login dari localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // LOGIN (nanti connect ke backend)
  const login = async (email, password) => {
    try {
      // sementara dummy (nanti ganti API)
      if (email === "admin@laundry.com" && password === "123456") {
        const fakeUser = {
          id: 1,
          name: "Admin Laundry",
          role: "admin",
          email,
        };

        setUser(fakeUser);
        localStorage.setItem("user", JSON.stringify(fakeUser));
        return { success: true };
      }

      return { success: false, message: "Email / password salah" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);