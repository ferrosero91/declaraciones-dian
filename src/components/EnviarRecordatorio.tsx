"use client";

import { useState, useEffect } from "react";
import { MessageSquare, AlertTriangle, X, Sparkles, Loader2 } from "lucide-react";
import { generarLinkWhatsApp, renderizarPlantilla } from "@/lib/urgencia";

interface Cliente {
  id: string;
  nombre_completo: string;
  cedula: string;
  celular_whatsapp?: string;
  tipo_ingresos: string;
}

interface Plantilla {
  id: string;
  nombre: string;
  cuerpo_texto: string;
}

interface Documento {
  documento: string;
  obligatorio: boolean;
}

interface Props {
  cliente: Cliente;
  fechaVencimiento?: string | null;
  onClose: () => void;
}

export default function EnviarRecordatorio({ cliente, fechaVencimiento: fechaVencProp, onClose }: Props) {
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<string>("");
  const [mensaje, setMensaje] = useState("");
  const [mensajeOriginal, setMensajeOriginal] = useState("");
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [usarIA, setUsarIA] = useState(false);
  const [puliendo, setPuliendo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [advertencia, setAdvertencia] = useState("");

  useEffect(() => {
    cargarDatos();
  }, [cliente.id]);

  useEffect(() => {
    if (fechaVencProp) {
      setFechaVencimiento(fechaVencProp);
    } else if (!fechaVencProp && cliente.cedula) {
      fetch(`/api/clientes/vencimiento?cedula=${cliente.cedula}`)
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          if (data?.fecha_vencimiento) setFechaVencimiento(data.fecha_vencimiento);
        })
        .catch(() => {});
    }
  }, [fechaVencProp, cliente.cedula]);

  async function cargarDatos() {
    try {
      const [resPlantillas, resDocs] = await Promise.all([
        fetch("/api/plantillas"),
        fetch(`/api/documentos?tipo=${cliente.tipo_ingresos}`),
      ]);

      if (resPlantillas.ok) {
        const data = await resPlantillas.json();
        setPlantillas(data.filter((p: Plantilla & { activa: boolean }) => p.activa !== false));
      }
      if (resDocs.ok) setDocumentos(await resDocs.json());
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    if (plantillaSeleccionada && documentos.length > 0) {
      const plantilla = plantillas.find((p) => p.id === plantillaSeleccionada);
      if (plantilla) {
        const checklist = documentos
          .filter((d) => d.obligatorio)
          .map((d) => `- ${d.documento}`)
          .join("\n");

        const textoRenderizado = renderizarPlantilla(plantilla.cuerpo_texto, {
          nombre: cliente.nombre_completo,
          fecha_vencimiento: fechaVencimiento || "(fecha pendiente)",
          documentos: checklist,
        });

        setMensaje(textoRenderizado);
        setMensajeOriginal(textoRenderizado);
      }
    }
  }, [plantillaSeleccionada, fechaVencimiento, documentos, plantillas, cliente.nombre_completo]);

  async function pulirConIA() {
    if (!mensajeOriginal) return;
    setPuliendo(true);
    try {
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: mensajeOriginal }),
      });
      if (res.ok) {
        const data = await res.json();
        setMensaje(data.mensaje);
      }
    } catch (error) {
      console.error("Error al pulir:", error);
    } finally {
      setPuliendo(false);
    }
  }

  function revertirIA() {
    setMensaje(mensajeOriginal);
  }

  async function handleEnviar() {
    if (!cliente.celular_whatsapp) {
      setAdvertencia("El cliente no tiene número de WhatsApp registrado");
      return;
    }

    setEnviando(true);

    try {
      await fetch("/api/envios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: cliente.id,
          plantilla_id: plantillaSeleccionada || undefined,
          mensaje_enviado: mensaje,
        }),
      });

      const link = generarLinkWhatsApp(cliente.celular_whatsapp, mensaje);
      window.open(link, "_blank");
      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-xl sm:rounded-lg p-5 sm:p-6 w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Enviar recordatorio</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="font-medium text-gray-900">{cliente.nombre_completo}</p>
          <p className="text-sm text-gray-500">CC: {cliente.cedula}</p>
          <p className="text-sm text-gray-500 capitalize">Tipo: {cliente.tipo_ingresos}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de vencimiento
            </label>
            <input
              type="date"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plantilla
            </label>
            <select
              value={plantillaSeleccionada}
              onChange={(e) => setPlantillaSeleccionada(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E]"
            >
              <option value="">Seleccionar plantilla...</option>
              {plantillas.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          {/* Toggle IA */}
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-md border border-purple-200">
            <div className="flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Mejorar con IA (Groq)</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (usarIA) {
                  revertirIA();
                  setUsarIA(false);
                } else {
                  setUsarIA(true);
                }
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                usarIA ? "bg-purple-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  usarIA ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {usarIA && (
            <button
              onClick={pulirConIA}
              disabled={puliendo || !mensajeOriginal}
              className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {puliendo ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Puliendo mensaje...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Pulir mensaje con IA
                </>
              )}
            </button>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje (editable)
            </label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E] font-mono text-sm"
            />
          </div>

          {advertencia && (
            <div className="flex items-center p-3 bg-yellow-50 rounded-md text-yellow-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span className="text-sm">{advertencia}</span>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            <button onClick={onClose} className="btn-secondary w-full sm:w-auto">
              Cancelar
            </button>
            <button
              onClick={handleEnviar}
              disabled={enviando || !mensaje}
              className="btn-whatsapp flex items-center justify-center disabled:opacity-50 w-full sm:w-auto"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {enviando ? "Abriendo WhatsApp..." : "Abrir en WhatsApp"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
