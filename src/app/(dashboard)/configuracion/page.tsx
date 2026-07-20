"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

interface Configuracion {
  umbral_urgente_dias: number;
  umbral_proximo_dias: number;
  umbral_vigilar_dias: number;
}

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<Configuracion>({
    umbral_urgente_dias: 5,
    umbral_proximo_dias: 15,
    umbral_vigilar_dias: 30,
  });
  const [perfil, setPerfil] = useState({
    nombre_completo: "",
    telefono: "",
  });
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarConfig();
  }, []);

  async function cargarConfig() {
    try {
      const res = await fetch("/api/configuracion");
      if (res.ok) {
        const data = await res.json();
        setConfig({
          umbral_urgente_dias: data.umbral_urgente_dias,
          umbral_proximo_dias: data.umbral_proximo_dias,
          umbral_vigilar_dias: data.umbral_vigilar_dias,
        });
        if (data.perfil) {
          setPerfil({
            nombre_completo: data.perfil.nombre_completo || "",
            telefono: data.perfil.telefono || "",
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function guardarConfig() {
    setGuardando(true);
    setMensaje("");
    try {
      const res = await fetch("/api/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          umbrales: config,
          perfil,
        }),
      });

      if (res.ok) {
        setMensaje("Configuración guardada correctamente");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al guardar");
    } finally {
      setGuardando(false);
    }
  }

  return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Configuracion</h2>

        <div className="space-y-6">
          {/* Perfil */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mi perfil</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input
                  type="text"
                  value={perfil.nombre_completo}
                  onChange={(e) => setPerfil({ ...perfil, nombre_completo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={perfil.telefono}
                  onChange={(e) => setPerfil({ ...perfil, telefono: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E]"
                />
              </div>
            </div>
          </div>

          {/* Umbrales de urgencia */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Semáforo de urgencia</h3>
            <p className="text-sm text-gray-500 mb-4">
              Configura cuántos días antes del vencimiento se activa cada color.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <label className="text-sm font-medium text-gray-700">Vencido/Hoy:</label>
                <span className="text-sm text-gray-500">0 días (siempre)</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                <label className="text-sm font-medium text-gray-700">Urgente:</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={config.umbral_urgente_dias}
                  onChange={(e) => setConfig({ ...config, umbral_urgente_dias: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E]"
                />
                <span className="text-sm text-gray-500">días o menos</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <label className="text-sm font-medium text-gray-700">Próximo:</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={config.umbral_proximo_dias}
                  onChange={(e) => setConfig({ ...config, umbral_proximo_dias: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E]"
                />
                <span className="text-sm text-gray-500">días o menos</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <label className="text-sm font-medium text-gray-700">Vigilar:</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={config.umbral_vigilar_dias}
                  onChange={(e) => setConfig({ ...config, umbral_vigilar_dias: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E]"
                />
                <span className="text-sm text-gray-500">días o menos</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <label className="text-sm font-medium text-gray-700">Tranquilo:</label>
                <span className="text-sm text-gray-500">más de {config.umbral_vigilar_dias} días</span>
              </div>
            </div>
          </div>

          {mensaje && (
            <div className={`p-3 rounded-md ${mensaje.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
              {mensaje}
            </div>
          )}

          <button
            onClick={guardarConfig}
            disabled={guardando}
            className="btn-primary flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {guardando ? "Guardando..." : "Guardar configuración"}
          </button>
        </div>
      </main>
  );
}
