"use client";

import { useEffect, useState } from "react";
import { Upload, Plus, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";

interface Vencimiento {
  id: string;
  anio_gravable: number;
  terminacion_inicio: number;
  terminacion_fin: number;
  fecha_vencimiento: string;
  origen: string;
}

interface Carga {
  id: string;
  anio_gravable: number;
  nombre_archivo: string;
  filas_importadas: number;
  filas_con_error: number;
  estado: string;
  importado_en: string;
}

export default function CalendarioPage() {
  const [vencimientos, setVencimientos] = useState<Vencimiento[]>([]);
  const [cargas, setCargas] = useState<Carga[]>([]);
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | null>(null);
  const [aniosDisponibles, setAniosDisponibles] = useState<number[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [vistaPrevia, setVistaPrevia] = useState<Vencimiento[]>([]);
  const [errores, setErrores] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [anioSeleccionado]);

  async function cargarDatos() {
    try {
      const resCargas = await fetch("/api/calendario?historial=true");
      if (resCargas.ok) {
        const cargasData = await resCargas.json();
        setCargas(cargasData);

        const yearSet = new Set<number>();
        cargasData.forEach((c: Carga) => yearSet.add(c.anio_gravable));
        const years = Array.from(yearSet).sort((a, b) => b - a);
        setAniosDisponibles(years);

        if (anioSeleccionado === null && years.length > 0) {
          setAnioSeleccionado(years[0]);
          return;
        }
      }

      if (anioSeleccionado !== null) {
        const resVenc = await fetch(`/api/calendario?anio=${anioSeleccionado}`);
        if (resVenc.ok) setVencimientos(await resVenc.json());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function excelSerialToDate(serial: number): string {
    const utcDays = Math.floor(serial - 25569);
    const utcMs = utcDays * 86400 * 1000;
    const date = new Date(utcMs);
    return date.toISOString().split("T")[0];
  }

  function formatFecha(fecha: string): string {
    const parts = fecha.split("T")[0].split("-");
    return `${parseInt(parts[2])}/${parseInt(parts[1])}/${parts[0]}`;
  }

  function procesarExcel(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      const filasValidas: Vencimiento[] = [];
      const erroresDetectados: string[] = [];

      json.forEach((fila: unknown, index: number) => {
        const f = fila as Record<string, unknown>;
        const anio = Number(f.anio_gravable);
        const inicio = Number(f.terminacion_inicio);
        const fin = Number(f.terminacion_fin);
        const rawFecha = f.fecha_vencimiento;

        if (isNaN(anio) || anio < 2020 || anio > 2030) return;
        if (isNaN(inicio) || inicio < 0 || inicio > 99) return;
        if (isNaN(fin) || fin < 0 || fin > 99) return;

        let fechaStr: string;
        if (typeof rawFecha === "number") {
          fechaStr = excelSerialToDate(rawFecha);
        } else if (typeof rawFecha === "string" && !isNaN(Date.parse(rawFecha))) {
          fechaStr = new Date(rawFecha).toISOString().split("T")[0];
        } else {
          erroresDetectados.push(`Fila ${index + 1}: Fecha inválida`);
          return;
        }

        filasValidas.push({
          id: `${index}`,
          anio_gravable: anio,
          terminacion_inicio: inicio,
          terminacion_fin: fin,
          fecha_vencimiento: fechaStr,
          origen: "excel",
        });
      });

      setVistaPrevia(filasValidas);
      setErrores(erroresDetectados);
      setShowUpload(true);
    };
    reader.readAsBinaryString(archivo);
  }

  async function confirmarCarga() {
    setLoading(true);
    try {
      const res = await fetch("/api/calendario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filas: vistaPrevia.map((v) => ({
            anio_gravable: v.anio_gravable,
            terminacion_inicio: v.terminacion_inicio,
            terminacion_fin: v.terminacion_fin,
            fecha_vencimiento: v.fecha_vencimiento,
          })),
          nombre_archivo: "carga_excel.xlsx",
        }),
      });

      if (res.ok) {
        setShowUpload(false);
        setVistaPrevia([]);
        setErrores([]);
        cargarDatos();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Calendario de Vencimientos</h2>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <select
              value={anioSeleccionado ?? ""}
              onChange={(e) => setAnioSeleccionado(parseInt(e.target.value))}
              className="flex-1 sm:flex-initial px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F5C6E] text-sm"
            >
              {aniosDisponibles.length === 0 && (
                <>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                </>
              )}
              {aniosDisponibles.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <label className="btn-primary flex items-center cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Cargar Excel
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={procesarExcel}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Tabla de vencimientos - desktop */}
        <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Terminacion</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Fecha Vencimiento</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Origen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vencimientos.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{v.terminacion_inicio.toString().padStart(2, "0")} - {v.terminacion_fin.toString().padStart(2, "0")}</td>
                  <td className="px-4 py-3 text-gray-900">{formatFecha(v.fecha_vencimiento)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${v.origen === "excel" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                      {v.origen}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vencimientos - mobile cards */}
        <div className="md:hidden grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
          {vencimientos.map((v) => (
            <div key={v.id} className="bg-white rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500 mb-1">{v.terminacion_inicio.toString().padStart(2, "0")} - {v.terminacion_fin.toString().padStart(2, "0")}</p>
              <p className="font-medium text-gray-900 text-sm">{formatFecha(v.fecha_vencimiento)}</p>
            </div>
          ))}
        </div>

        {/* Historial de cargas */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Historial de cargas</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {cargas.map((c) => (
              <div key={c.id} className="p-3 sm:p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{c.nombre_archivo}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {new Date(c.importado_en).toLocaleDateString("es-CO")} - {c.filas_importadas} filas importadas
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  c.estado === "procesado" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {c.estado}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal de vista previa */}
        {showUpload && (
          <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white rounded-t-xl sm:rounded-lg p-5 sm:p-6 w-full sm:max-w-2xl max-h-[85vh] overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">Vista previa de carga</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Filas válidas: <span className="font-bold text-green-600">{vistaPrevia.length}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Filas con error: <span className="font-bold text-red-600">{errores.length}</span>
                </p>
              </div>

              {errores.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 rounded-md">
                  <p className="text-sm font-medium text-red-800 mb-2">Errores encontrados:</p>
                  <ul className="text-sm text-red-700 list-disc list-inside">
                    {errores.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="max-h-60 overflow-y-auto mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Terminación</th>
                      <th className="px-3 py-2 text-left">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {vistaPrevia.slice(0, 20).map((v, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2">{v.terminacion_inicio}-{v.terminacion_fin}</td>
                        <td className="px-3 py-2">{formatFecha(v.fecha_vencimiento)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => { setShowUpload(false); setVistaPrevia([]); setErrores([]); }}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarCarga}
                  disabled={loading || vistaPrevia.length === 0}
                  className="btn-primary disabled:opacity-50 w-full sm:w-auto"
                >
                  {loading ? "Cargando..." : "Confirmar carga"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
  );
}
