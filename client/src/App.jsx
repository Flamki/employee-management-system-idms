import { useEffect, useState } from "react";
import api, { clearAuthToken } from "./api";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";

function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadMe = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        clearAuthToken();
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    loadMe();
  }, []);

  const handleLogin = (nextUser) => setUser(nextUser);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearAuthToken();
    }
    setUser(null);
  };

  if (authLoading) {
    return <div className="centered-state">Loading...</div>;
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
