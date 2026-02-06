import express from "express";
import cors from "cors";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Logs para debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ============================================
// PROXY 1: TESI API (Login)
// ============================================
app.post("/tesi-api/v1.0/chequeoCredencialesFull", async (req, res) => {
  try {
    console.log("📨 [TESI PROXY] Request recibido:", {
      cuit: req.body.cuit,
      tiene_password: !!req.body.password,
    });

    const response = await axios.post(
      "https://tesi.sanisidro.gob.ar/api/v1.0/chequeoCredencialesFull",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("✅ [TESI PROXY] Respuesta exitosa:", {
      success: response.data?.success,
      user: response.data?.user?.name,
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ [TESI PROXY] Error:", error.message);
    console.error("Error response:", error.response?.data);

    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Error al conectar con TESI",
    });
  }
});

// ============================================
// PROXY 2: QR API (Lectura de QR)
// ============================================
app.post("/qr-api/servicios/lectura/:qr", async (req, res) => {
  try {
    const { qr } = req.params;
    console.log("📨 [QR PROXY] Request recibido:", { qr });

    const response = await axios.post(
      `https://staging-dev.sanisidro.gob.ar/api/qr/servicios/lectura/${qr}`,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("✅ [QR PROXY] Respuesta exitosa");
    res.json(response.data);
  } catch (error) {
    console.error("❌ [QR PROXY] Error:", error.message);

    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Error al procesar QR",
    });
  }
});

// ============================================
// Servir archivos estáticos de React
// ============================================
app.use(express.static(path.join(__dirname, "dist")));

// Todas las demás rutas → React Router (usando middleware)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
🚀 Servidor corriendo en puerto ${PORT}
📍 Proxies configurados:
   - /tesi-api → https://tesi.sanisidro.gob.ar/api
   - /qr-api → https://staging-dev.sanisidro.gob.ar/api/qr
  `);
});
