"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface Envio {
  id: string;
  cliente: {
    nombre_completo: string;
    cedula: string;
  };
  fecha_marcado: string;
  mensaje_enviado: string;
  notas?: string;
}

export default function HistorialPage() {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarEnvios(1);
  }, []);

  async function cargarEnvios(page: number) {
    try {
      const res = await fetch(`/api/envios?page=${page}`);
      if (res.ok) {
        const data = await res.json();
        setEnvios(data.envios);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const enviosFiltrados = envios.filter((e) =>
    e.cliente.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.cliente.cedula.includes(busqueda)
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Historial de Envios</h2>

      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-6">
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

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Cliente</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Cedula</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Fecha envio</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Mensaje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {enviosFiltrados.map((envio) => (
              <tr key={envio.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{envio.cliente.nombre_completo}</td>
                <td className="px-4 py-3 text-gray-600">{envio.cliente.cedula}</td>
                <td className="px-4 py-3 text-gray-600 text-sm">
                  {new Date(envio.fecha_marcado).toLocaleString("es-CO")}
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{envio.mensaje_enviado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {enviosFiltrados.map((envio) => (
          <div key={envio.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">{envio.cliente.nombre_completo}</p>
                <p className="text-xs text-gray-500">CC: {envio.cliente.cedula}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(envio.fecha_marcado).toLocaleDateString("es-CO")}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{envio.mensaje_enviado}</p>
          </div>
        ))}
      </div>

      {enviosFiltrados.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No hay envios registrados</p>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => cargarEnvios(page)}
              className={`px-3 py-1 rounded-md text-sm ${
                page === pagination.page
                  ? "bg-[#0F5C6E] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
