import React, { useState } from "react";
import { User, Lock, AlertCircle, Loader } from "lucide-react";
import { loginUser } from "../services/Auth";

const Login = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    cuit: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.cuit || !credentials.password) {
      setError("Por favor, ingresa tu CUIT y contraseña");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await loginUser(credentials);

      if (response.success) {
        onLoginSuccess(response.user);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Círculos decorativos animados */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-48 h-48 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Logo Boletería"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-emerald-700 mb-2">Boletería</h1>
            <p className="text-gray-500 text-sm">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo CUIT */}
            <div>
              <label
                htmlFor="cuit"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                CUIT
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={20} className="text-emerald-400" />
                </div>
                <input
                  type="text"
                  id="cuit"
                  name="cuit"
                  value={credentials.cuit}
                  onChange={handleChange}
                  placeholder="20123456789"
                  maxLength={11}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-emerald-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-shake">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Botón de login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  <span>Ingresando...</span>
                </>
              ) : (
                <span>Ingresar</span>
              )}
            </button>

            {/* Link olvidaste contraseña */}
            <div className="text-center">
              <a
                href="#"
                className="text-sm text-emerald-500 hover:text-emerald-600 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Sistema de Gestión de Boletería
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
