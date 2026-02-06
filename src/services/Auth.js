import axios from "axios";

const VALID_ROLES = ["BOE Incidentes"];

export const loginUser = async (credentials) => {
  try {
    const response = await fetch("/tesi-api/v1.0/chequeoCredencialesFull", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        cuit: credentials.cuit,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log(data);

    if (data?.success && data?.user) {
      const user = data.user;

      const hasValidRole = user.roles?.some((role) =>
        VALID_ROLES.includes(role),
      );

      if (!hasValidRole) {
        return {
          success: false,
          user: null,
          message: "No tienes permisos para acceder a esta aplicación",
        };
      }

      localStorage.setItem("boleteria-user", JSON.stringify(user));
      localStorage.setItem("boleteria-cuit", credentials.cuit);
      localStorage.setItem("boleteria-password", credentials.password);

      return {
        success: true,
        user: user,
        message: "Login exitoso",
      };
    } else {
      return {
        success: false,
        user: null,
        message: data?.message || "Credenciales inválidas",
      };
    }
  } catch (error) {
    console.error("Error en loginUser:", error);
    return {
      success: false,
      user: null,
      message: error.message || "Error de conexión. Intenta nuevamente.",
    };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("boleteria-user");
  localStorage.removeItem("boleteria-cuit");
  localStorage.removeItem("boleteria-password");
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("boleteria-user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
};
