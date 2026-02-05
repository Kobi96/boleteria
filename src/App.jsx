import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import Login from "./pages/Login";
import QRScanner from "./components/QRScanner";
import { getCurrentUser, logoutUser } from "./services/Auth";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  // Pantalla de carga inicial
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  // Si no hay usuario, mostrar login
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Si hay usuario, mostrar aplicación principal
  return (
    <div className="App">
      {/* Header con info del usuario y logout */}
      <header className="app-header">
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-role">{user.roles?.[0]}</span>
        </div>
        <button onClick={handleLogout} className="logout-button">
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </header>

      {/* Aplicación principal - Scanner QR */}
      <main className="app-content">
        <QRScanner />
      </main>
    </div>
  );
}

export default App;
