"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter, MessageSquare, Edit3, Trash2, CheckCircle, Circle } from "lucide-react";
import EnviarRecordatorio from "@/components/EnviarRecordatorio";
import { obtenerColorHex, obtenerLabelColor } from "@/lib/urgencia";

interface Cliente {
  id: string;
  nombre_completo: string;
  cedula: string;
  celular_whatsapp?: string;
  tipo_ingresos: string;
  activo: boolean;
  completado: boolean;
  notas?: string;
  fecha_vencimiento: string | null;
  color_urgencia: string;
  dias_restantes: number | null;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [clienteRecordatorio, setClienteRecordatorio] = useState<Cliente | null>(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  async function cargarClientes() {
    try {
      const res = await fetch("/api/clientes");
      if (res.ok) setClientes(await res.json());
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  }

  async function guardarCliente(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      nombre_completo: formData.get("nombre_completo") as string,
      cedula: formData.get("cedula") as string,
      celular_whatsapp: formData.get("celular_whatsapp") as string,
      tipo_ingresos: formData.get("tipo_ingresos") as string,
      notas: formData.get("notas") as string,
    };

    try {
      if (clienteEditando) {
        await fetch("/api/clientes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: clienteEditando.id, ...data }),
        });
      } else {
        await fetch("/api/clientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      setShowForm(false);
      setClienteEditando(null);
      cargarClientes();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  }

  async function eliminarCliente(id: string) {
    if (!confirm("¿Eliminar este cliente?")) return;
    await fetch(`/api/clientes?id=${id}`, { method: "DELETE" });
    cargarClientes();
  }

  async function toggleCompletado(id: string) {
    await fetch("/api/clientes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completado: !clientes.find(c => c.id === id)?.completado }),
    });
    cargarClientes();
  }

  const clientesFiltrados = clientes.filter((c) => {
    const coincideBusqueda = c.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.cedula.includes(busqueda);
    const coincideTipo = filtroTipo === "todos" || c.tipo_ingresos === filtroTipo;
    return coincideBusqueda && coincideTipo;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Clientes</h2>
        <button
          onClick={() => { setShowForm(true); setClienteEditando(null); }}
          className="btn-primary flex items-center text-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />Nuevo cliente
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o cedula..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E] text-sm"
              />
            </div>
          </div>
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E] text-sm"
            >
              <option value="todos">Todos los tipos</option>
              <option value="empleado">Empleado</option>
              <option value="independiente">Independiente</option>
              <option value="pensionado">Pensionado</option>
              <option value="mixto">Mixto</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vista de tabla en desktop */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Cedula</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Vencimiento</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Dias</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">WhatsApp</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tipo</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span
                    className="badge-color"
                    title={obtenerLabelColor(cliente.color_urgencia)}
                    style={{ backgroundColor: obtenerColorHex(cliente.color_urgencia) }}
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{cliente.nombre_completo}</td>
                <td className="px-4 py-3 text-gray-600">{cliente.cedula}</td>
                <td className="px-4 py-3 text-gray-600">{cliente.fecha_vencimiento || "-"}</td>
                <td className="px-4 py-3">
                  {cliente.dias_restantes !== null ? (
                    <span className="text-sm font-medium" style={{ color: obtenerColorHex(cliente.color_urgencia) }}>
                      {cliente.dias_restantes <= 0 ? "Vencido" : `${cliente.dias_restantes} dias`}
                    </span>
                  ) : <span className="text-gray-400">-</span>}
                </td>
                <td className="px-4 py-3 text-gray-600">{cliente.celular_whatsapp || "-"}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{cliente.tipo_ingresos}</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    {!cliente.completado && cliente.celular_whatsapp && (
                      <button onClick={() => setClienteRecordatorio(cliente)} className="text-green-600 hover:underline text-sm flex items-center">
                        <MessageSquare className="w-3 h-3 mr-1" />Recordatorio
                      </button>
                    )}
                    <button onClick={() => { setClienteEditando(cliente); setShowForm(true); }} className="text-[#0F5C6E] hover:underline text-sm">Editar</button>
                    <button onClick={() => toggleCompletado(cliente.id)} className="text-gray-600 hover:underline text-sm">
                      {cliente.completado ? "Pendiente" : "Completado"}
                    </button>
                    <button onClick={() => eliminarCliente(cliente.id)} className="text-red-500 hover:underline text-sm">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de cards en movil/tablet */}
      <div className="lg:hidden space-y-3">
        {clientesFiltrados.map((cliente) => (
          <div key={cliente.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center min-w-0">
                <span
                  className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                  style={{ backgroundColor: obtenerColorHex(cliente.color_urgencia) }}
                />
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{cliente.nombre_completo}</p>
                  <p className="text-xs text-gray-500">CC: {cliente.cedula}</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize flex-shrink-0">
                {cliente.tipo_ingresos}
              </span>
            </div>

            {(cliente.fecha_vencimiento || cliente.dias_restantes !== null) && (
              <div className="flex items-center gap-3 mb-3 text-xs">
                {cliente.fecha_vencimiento && (
                  <span className="text-gray-500">Vence: {cliente.fecha_vencimiento}</span>
                )}
                {cliente.dias_restantes !== null && (
                  <span className="font-medium" style={{ color: obtenerColorHex(cliente.color_urgencia) }}>
                    {cliente.dias_restantes <= 0 ? "Vencido" : `${cliente.dias_restantes} dias`}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              {!cliente.completado && cliente.celular_whatsapp && (
                <button
                  onClick={() => setClienteRecordatorio(cliente)}
                  className="flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100"
                >
                  <MessageSquare className="w-3 h-3 mr-1" />Recordatorio
                </button>
              )}
              <button
                onClick={() => { setClienteEditando(cliente); setShowForm(true); }}
                className="flex items-center px-3 py-1.5 text-xs font-medium text-[#0F5C6E] bg-[#0F5C6E]/5 rounded-md hover:bg-[#0F5C6E]/10"
              >
                <Edit3 className="w-3 h-3 mr-1" />Editar
              </button>
              <button
                onClick={() => toggleCompletado(cliente.id)}
                className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100"
              >
                {cliente.completado ? <><Circle className="w-3 h-3 mr-1" />Pendiente</> : <><CheckCircle className="w-3 h-3 mr-1" />Completado</>}
              </button>
              <button
                onClick={() => eliminarCliente(cliente.id)}
                className="flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
              >
                <Trash2 className="w-3 h-3 mr-1" />Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {clientesFiltrados.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No se encontraron clientes</p>
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-xl sm:rounded-lg p-5 sm:p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {clienteEditando ? "Editar cliente" : "Nuevo cliente"}
            </h3>
            <form onSubmit={guardarCliente} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input type="text" name="nombre_completo" defaultValue={clienteEditando?.nombre_completo} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cedula</label>
                <input type="text" name="cedula" defaultValue={clienteEditando?.cedula} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input type="tel" name="celular_whatsapp" defaultValue={clienteEditando?.celular_whatsapp}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de ingresos</label>
                <select name="tipo_ingresos" defaultValue={clienteEditando?.tipo_ingresos} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E] text-sm">
                  <option value="empleado">Empleado</option>
                  <option value="independiente">Independiente</option>
                  <option value="pensionado">Pensionado</option>
                  <option value="mixto">Mixto</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea name="notas" defaultValue={clienteEditando?.notas} rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E] text-sm" />
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setClienteEditando(null); }}
                  className="btn-secondary w-full sm:w-auto">Cancelar</button>
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  {clienteEditando ? "Guardar cambios" : "Crear cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de recordatorio */}
      {clienteRecordatorio && (
        <EnviarRecordatorio
          cliente={clienteRecordatorio}
          fechaVencimiento={clienteRecordatorio.fecha_vencimiento}
          onClose={() => setClienteRecordatorio(null)}
        />
      )}
    </main>
  );
}
