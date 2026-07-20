"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Plantilla {
  id: string;
  nombre: string;
  nivel_urgencia: string;
  cuerpo_texto: string;
  usar_ia: boolean;
  activa: boolean;
}

export default function PlantillasPage() {
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [plantillaEditando, setPlantillaEditando] = useState<Plantilla | null>(null);

  useEffect(() => {
    cargarPlantillas();
  }, []);

  async function cargarPlantillas() {
    try {
      const res = await fetch("/api/plantillas");
      if (res.ok) setPlantillas(await res.json());
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function guardarPlantilla(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      nombre: formData.get("nombre") as string,
      nivel_urgencia: formData.get("nivel_urgencia") as string,
      cuerpo_texto: formData.get("cuerpo_texto") as string,
      usar_ia: formData.get("usar_ia") === "true",
      activa: true,
    };

    try {
      if (plantillaEditando) {
        await fetch("/api/plantillas", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: plantillaEditando.id, ...data }),
        });
      } else {
        await fetch("/api/plantillas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      setShowForm(false);
      setPlantillaEditando(null);
      cargarPlantillas();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function eliminarPlantilla(id: string) {
    if (!confirm("¿Eliminar esta plantilla?")) return;
    await fetch(`/api/plantillas?id=${id}`, { method: "DELETE" });
    cargarPlantillas();
  }

  async function toggleActiva(id: string, activa: boolean) {
    await fetch("/api/plantillas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, activa: !activa }),
    });
    cargarPlantillas();
  }

  const getNivelColor = (nivel: string) => {
    const colores: Record<string, string> = {
      vencido: "bg-red-100 text-red-800",
      urgente: "bg-orange-100 text-orange-800",
      proximo: "bg-yellow-100 text-yellow-800",
      vigilar: "bg-blue-100 text-blue-800",
      tranquilo: "bg-green-100 text-green-800",
      cualquiera: "bg-gray-100 text-gray-800",
    };
    return colores[nivel] || "bg-gray-100 text-gray-800";
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Plantillas de Mensajes</h2>
          <button
            onClick={() => { setShowForm(true); setPlantillaEditando(null); }}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />Nueva plantilla
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plantillas.map((plantilla) => (
            <div key={plantilla.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{plantilla.nombre}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getNivelColor(plantilla.nivel_urgencia)}`}>
                  {plantilla.nivel_urgencia}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{plantilla.cuerpo_texto}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => { setPlantillaEditando(plantilla); setShowForm(true); }}
                    className="text-[#0F5C6E] hover:underline text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => toggleActiva(plantilla.id, plantilla.activa)}
                    className="text-gray-600 hover:underline text-sm"
                  >
                    {plantilla.activa ? "Desactivar" : "Activar"}
                  </button>
                  <button
                    onClick={() => eliminarPlantilla(plantilla.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {plantilla.usar_ia && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">IA</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal de formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white rounded-t-xl sm:rounded-lg p-5 sm:p-6 w-full sm:max-w-lg max-h-[85vh] overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">
                {plantillaEditando ? "Editar plantilla" : "Nueva plantilla"}
              </h3>
              <form onSubmit={guardarPlantilla} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    defaultValue={plantillaEditando?.nombre}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de urgencia</label>
                  <select
                    name="nivel_urgencia"
                    defaultValue={plantillaEditando?.nivel_urgencia || "cualquiera"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E]"
                  >
                    <option value="cualquiera">Cualquiera</option>
                    <option value="vencido">Vencido</option>
                    <option value="urgente">Urgente</option>
                    <option value="proximo">Próximo</option>
                    <option value="vigilar">Vigilar</option>
                    <option value="tranquilo">Tranquilo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cuerpo del mensaje (usa {"{{nombre}}"}, {"{{fecha_vencimiento}}"}, {"{{documentos}}"})
                  </label>
                  <textarea
                    name="cuerpo_texto"
                    defaultValue={plantillaEditando?.cuerpo_texto}
                    rows={6}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E] font-mono text-sm"
                    placeholder="Estimado/a {{nombre}}, su declaración de renta vence el {{fecha_vencimiento}}. Documentos requeridos: {{documentos}}"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usar IA para mejorar</label>
                  <select
                    name="usar_ia"
                    defaultValue={plantillaEditando?.usar_ia ? "true" : "false"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E]"
                  >
                    <option value="false">No</option>
                    <option value="true">Sí (Groq)</option>
                  </select>
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setPlantillaEditando(null); }}
                    className="btn-secondary w-full sm:w-auto"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary w-full sm:w-auto">
                    {plantillaEditando ? "Guardar cambios" : "Crear plantilla"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
  );
}
