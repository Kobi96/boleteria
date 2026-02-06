import React, { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import "./QRScanner.css";

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scanning) {
      const html5Qrcode = new Html5Qrcode("qr-reader");

      html5Qrcode
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
          onScanSuccess,
          onScanError,
        )
        .catch((err) => {
          console.error("Error al iniciar la cámara:", err);
          setError("No se pudo acceder a la cámara trasera.");
          setScanning(false);
        });

      return () => {
        html5Qrcode
          .stop()
          .then(() => html5Qrcode.clear())
          .catch((error) => {
            console.error("Error al limpiar el scanner:", error);
          });
      };
    }
  }, [scanning]);

  const onScanSuccess = async (decodedText, decodedResult) => {
    setScanResult(decodedText);
    setScanning(false);

    // Enviar a la API
    await sendToAPI(decodedText);
  };

  const onScanError = (errorMessage) => {
    // No mostrar errores de escaneo continuos
  };

  const sendToAPI = async (qrData) => {
    setLoading(true);
    setError(null);

    try {
      // Obtener credenciales del localStorage
      const cuit = localStorage.getItem("boleteria-cuit");
      const password = localStorage.getItem("boleteria-password");

      const encodedQR = encodeURIComponent(qrData);

      const response = await axios.post(
        `/qr-api/servicios/lectura/${encodedQR}`,
      );

      console.log("Respuesta de la API:", response.data);
      alert("✅ QR procesado exitosamente");
    } catch (err) {
      console.error("Error al enviar a la API:", err);
      setError(err.response?.data?.message || "Error al procesar el código QR");
      alert("❌ Error al procesar el código QR");
    } finally {
      setLoading(false);
    }
  };

  const startScanning = () => {
    setScanResult(null);
    setError(null);
    setScanning(true);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  return (
    <div className="qr-scanner-container">
      <h1>Escáner de Códigos QR</h1>

      {!scanning && !scanResult && (
        <button className="btn-primary" onClick={startScanning}>
          📷 Iniciar Escáner
        </button>
      )}

      {scanning && (
        <div className="scanner-wrapper">
          <div id="qr-reader"></div>
          <button className="btn-secondary" onClick={stopScanning}>
            ❌ Detener Escáner
          </button>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Procesando código QR...</p>
        </div>
      )}

      {scanResult && !loading && (
        <div className="result-container">
          <h2>✅ Código Escaneado</h2>
          <div className="result-box">
            <p>{scanResult}</p>
          </div>
          <button className="btn-primary" onClick={startScanning}>
            🔄 Escanear Nuevo Código
          </button>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
