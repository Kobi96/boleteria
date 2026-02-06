import axios from "axios";

const VALID_ROLES = ["BOE Incidentes"];

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      "/tesi-api/v1.0/chequeoCredencialesFull",
      {
        cuit: credentials.cuit,
        password: credentials.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response);
    if (response.data?.success && response.data?.user) {
      const user = response.data.user;

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
        message: response.data?.message || "Credenciales inválidas",
      };
    }
  } catch (error) {
    console.error("Error en loginUser:", error);
    return {
      success: false,
      user: null,
      message:
        error.response?.data?.message ||
        "Error de conexión. Intenta nuevamente.",
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
