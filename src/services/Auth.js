import axios from "axios";

const VALID_ROLES = ["BOE Patrulla", "BOE Admin"];

export const loginUser = async (credentials) => {
  try {
    const response = {
      data: {
        success: true,
        user: {
          dni: "21923152",
          name: "CHISNERMAN, MAXIMILIANO CESAR",
          oficina: "Subsecretaría de Innovación",
          funcion: "Programador",
          imagen: null,
          roles: [
            "Administrador",
            "Administrador Incidentes",
            "Agendas",
            "ARSI",
            "ARSI Cuenta Corriente",
            "ARSI Dirección",
            "ARSI Revisión",
            "BOE Admin",
            "BOE Incidentes",
            "Cartola Permiso",
            "Consulta Ciudadana",
            "Defensa Del Consumidor",
            "Delegaciones",
            "DGE",
            "Digitalización",
            "Director de Obras",
            "Director General",
            "Exenciones",
            "Incidentes",
            "Legales",
            "Licencias",
            "Licencias Dashboard",
            "Licencias Superuser",
            "Municipal",
            "Obras Particulares",
            "Planeamiento Urbano",
            "Recursos Humanos",
            "RRHH-Loys",
            "Servicios Asistencia",
            "Solucionador",
            "Supervisor Digitalización",
            "Tablero de Control",
            "Validador Planeamiento",
            "Visualizador",
          ],
          qr: "https://tesi.sanisidro.gob.ar/confirmacionCredencial/eyJpdiI6IktBQWdtWkkrQnJjZzlNTXFhQlJJT2c9PSIsInZhbHVlIjoidktUN1cyMlNBVjU2SDRTZjFrV29EQT09IiwibWFjIjoiZDc0NmRmMDAzYTJhNjJmZmMzYzg0YWRkZTcxYzU1YTNmZTI0N2ViY2NlMDg1ZTc2OWU5MTMwY2IxZjI5MzFhOSIsInRhZyI6IiJ9",
          id: 1331,
        },
      },
      status: 200,
      statusText: "OK",
      headers: {
        "access-control-allow-credentials": "true, true",
        "access-control-allow-headers":
          "Content-Type, Authorization, X-Requested-With",
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-allow-origin": "http://localhost:5173",
        "cache-control": "no-cache, private",
        connection: "close",
        "content-encoding": "gzip",
        "content-type": "application/json",
        date: "Thu, 05 Feb 2026 16:38:32 GMT",
        server: "nginx/1.20.1",
        "transfer-encoding": "chunked",
        vary: "Accept-Encoding, Origin",
        "x-powered-by": "PHP/8.1.29",
      },
      config: {
        transitional: {
          silentJSONParsing: true,
          forcedJSONParsing: true,
          clarifyTimeoutError: false,
        },
        adapter: ["xhr", "http", "fetch"],
        transformRequest: [null],
        transformResponse: [null],
        timeout: 0,
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
        maxContentLength: -1,
        maxBodyLength: -1,
        env: {},
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        method: "post",
        url: "/tesi-api/v1.0/chequeoCredencialesFull",
        data: '{"cuit":"20219231521","password":"123"}',
        allowAbsoluteUrls: true,
      },
      request: {},
    };
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
