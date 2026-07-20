"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle, CheckCircle, Clock, Send, Users
} from "lucide-react";
import EnviarRecordatorio from "@/components/EnviarRecordatorio";
import { formatFechaLocal } from "@/lib/format";

interface ClienteColor {
  id: string;
  nombre_completo: string;
  cedula: string;
  tipo_ingresos: string;
  completado: boolean;
  color: string;
  fecha_vencimiento: string | null;
  envios_hoy: boolean;
}

interface Stats {
  total: number;
  vencidos: number;
  urgentes: number;
  proximos: number;
  vigilar: number;
  tranquilos: number;
  completados: number;
  pendientesContactarHoy: number;
  enviosHoy: number;
  enviosTotal: number;
}

const COLOR_MAP: Record<string, { hex: string }> = {
  vencido: { hex: "#DC2626" },
  urgente: { hex: "#EA580C" },
  proximo: { hex: "#D97706" },
  vigilar: { hex: "#2563EB" },
  tranquilo: { hex: "#16A34A" },
  completado: { hex: "#9CA3AF" },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [clientes, setClientes] = useState<ClienteColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [clienteEnviar, setClienteEnviar] = useState<ClienteColor | null>(null);

  useEffect(() => { cargarDatos(); }, []);

  async function cargarDatos() {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setClientes(data.clientes);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-gray-500">Cargando...</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-gray-500">Total</p>
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-gray-500">Vencidos</p>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold" style={{ color: "#DC2626" }}>{stats.vencidos}</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-gray-500">Urgentes</p>
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold" style={{ color: "#EA580C" }}>{stats.urgentes}</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-gray-500">Pendientes Hoy</p>
              <Send className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold" style={{ color: "#7C3AED" }}>{stats.pendientesContactarHoy}</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-gray-500">Enviados Hoy</p>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold" style={{ color: "#16A34A" }}>{stats.enviosHoy}</p>
            <p className="text-xs text-gray-400 mt-1">Total: {stats.enviosTotal}</p>
          </div>
        </div>
      )}

      {stats && (
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
          {[
            { label: "Vencidos", count: stats.vencidos, color: "#DC2626" },
            { label: "Urgentes", count: stats.urgentes, color: "#EA580C" },
            { label: "Proximos", count: stats.proximos, color: "#D97706" },
            { label: "Vigilar", count: stats.vigilar, color: "#2563EB" },
            { label: "Tranquilos", count: stats.tranquilos, color: "#16A34A" },
            { label: "Completados", count: stats.completados, color: "#9CA3AF" },
          ].map((item) => (
            <div key={item.label} className="flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white border border-gray-200">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full mr-1.5 sm:mr-2" style={{ backgroundColor: item.color }} />
              <span className="text-xs sm:text-sm text-gray-600">{item.label}: <strong>{item.count}</strong></span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Proximos vencimientos</h3>
          <Link href="/clientes" className="text-xs sm:text-sm text-[#0F5C6E] hover:underline">Ver todos</Link>
        </div>
        <div className="divide-y divide-gray-200">
          {clientes
            .filter((c) => c.color !== "completado" && c.color !== "tranquilo")
            .slice(0, 10)
            .map((cliente) => (
              <div key={cliente.id} className="p-3 sm:p-4 hover:bg-gray-50">
                {/* Desktop */}
                <div className="hidden sm:flex items-center justify-between">
                  <div className="flex items-center min-w-0">
                    <span className="w-3 h-3 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: COLOR_MAP[cliente.color]?.hex || "#9CA3AF" }} />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{cliente.nombre_completo}</p>
                      <p className="text-sm text-gray-500 truncate">
                        CC: {cliente.cedula} - {cliente.tipo_ingresos}
                        {cliente.fecha_vencimiento && <> - Vence: {formatFechaLocal(cliente.fecha_vencimiento)}</>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                    {cliente.envios_hoy && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Enviado</span>
                    )}
                    <button onClick={() => setClienteEnviar(cliente)} className="btn-whatsapp text-xs sm:text-sm whitespace-nowrap">
                      Recordatorio
                    </button>
                  </div>
                </div>
                {/* Mobile */}
                <div className="sm:hidden">
                  <div className="flex items-center mb-2">
                    <span className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: COLOR_MAP[cliente.color]?.hex || "#9CA3AF" }} />
                    <p className="font-medium text-gray-900 text-sm truncate">{cliente.nombre_completo}</p>
                  </div>
                  <p className="text-xs text-gray-500 mb-2 ml-5">
                    CC: {cliente.cedula} - {cliente.tipo_ingresos}
                    {cliente.fecha_vencimiento && <> - {formatFechaLocal(cliente.fecha_vencimiento)}</>}
                  </p>
                  <div className="flex items-center gap-2 ml-5">
                    {cliente.envios_hoy && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Enviado</span>
                    )}
                    <button onClick={() => setClienteEnviar(cliente)} className="btn-whatsapp text-xs">
                      Recordatorio
                    </button>
                  </div>
                </div>
              </div>
            ))}
          {clientes.filter((c) => c.color !== "completado" && c.color !== "tranquilo").length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
              <p>No hay clientes con vencimientos proximos</p>
            </div>
          )}
        </div>
      </div>

      {clienteEnviar && (
        <EnviarRecordatorio
          cliente={{ id: clienteEnviar.id, nombre_completo: clienteEnviar.nombre_completo, cedula: clienteEnviar.cedula, tipo_ingresos: clienteEnviar.tipo_ingresos }}
          fechaVencimiento={clienteEnviar.fecha_vencimiento}
          onClose={() => { setClienteEnviar(null); cargarDatos(); }}
        />
      )}
    </main>
  );
}
