import { describe, it, expect } from 'vitest';
import { renderizarPlantilla, generarLinkWhatsApp, calcularColorUrgenciaPura, obtenerColorHex, obtenerLabelColor } from '@/lib/urgencia';

describe('calcularColorUrgenciaPura', () => {
  const defaults = { urgente: 5, proximo: 15, vigilar: 30 };

  it('debería retornar "vencido" si la fecha ya pasó', () => {
    const fechaPasada = new Date();
    fechaPasada.setDate(fechaPasada.getDate() - 5);
    expect(calcularColorUrgenciaPura(fechaPasada, defaults)).toBe('vencido');
  });

  it('debería retornar "vencido" si vence hoy', () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    expect(calcularColorUrgenciaPura(hoy, defaults)).toBe('vencido');
  });

  it('debería retornar "urgente" si vence en 3 días', () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 3);
    expect(calcularColorUrgenciaPura(fecha, defaults)).toBe('urgente');
  });

  it('debería retornar "proximo" si vence en 10 días', () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 10);
    expect(calcularColorUrgenciaPura(fecha, defaults)).toBe('proximo');
  });

  it('debería retornar "vigilar" si vence en 20 días', () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 20);
    expect(calcularColorUrgenciaPura(fecha, defaults)).toBe('vigilar');
  });

  it('debería retornar "tranquilo" si vence en 40 días', () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 40);
    expect(calcularColorUrgenciaPura(fecha, defaults)).toBe('tranquilo');
  });

  it('debería usar umbrales personalizados', () => {
    const custom = { urgente: 10, proximo: 20, vigilar: 60 };
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 8);
    expect(calcularColorUrgenciaPura(fecha, custom)).toBe('urgente');

    const fecha2 = new Date();
    fecha2.setDate(fecha2.getDate() + 15);
    expect(calcularColorUrgenciaPura(fecha2, custom)).toBe('proximo');
  });
});

describe('renderizarPlantilla', () => {
  it('debería reemplazar {{nombre}}', () => {
    expect(renderizarPlantilla('Hola {{nombre}}', { nombre: 'Juan' })).toBe('Hola Juan');
  });

  it('debería reemplazar {{fecha_vencimiento}}', () => {
    expect(renderizarPlantilla('Vence el {{fecha_vencimiento}}', { fecha_vencimiento: '15/08/2026' })).toBe('Vence el 15/08/2026');
  });

  it('debería reemplazar {{documentos}}', () => {
    expect(renderizarPlantilla('Docs:\n{{documentos}}', { documentos: '- RUT\n- Cert' })).toBe('Docs:\n- RUT\n- Cert');
  });

  it('debería reemplazar múltiples variables', () => {
    expect(renderizarPlantilla('{{nombre}} vence el {{fecha_vencimiento}}', {
      nombre: 'María',
      fecha_vencimiento: '20/09/2026',
    })).toBe('María vence el 20/09/2026');
  });
});

describe('generarLinkWhatsApp', () => {
  it('debería generar link wa.me con código país 57', () => {
    const link = generarLinkWhatsApp('3001234567', 'Hola test');
    expect(link).toBe('https://wa.me/573001234567?text=Hola%20test');
  });

  it('debería codificar el mensaje con espacios', () => {
    const link = generarLinkWhatsApp('3001234567', 'Hola, tu renta vence el 15/08');
    expect(link).toContain('https://wa.me/573001234567?text=');
    expect(link).toContain('Hola%2C');
  });

  it('debería limpiar caracteres no numéricos del teléfono', () => {
    const link = generarLinkWhatsApp('+57 300 123 4567', 'Test');
    expect(link).toContain('573001234567');
  });
});

describe('obtenerColorHex', () => {
  it('debería retornar color hex correcto para cada estado', () => {
    expect(obtenerColorHex('vencido')).toBe('#DC2626');
    expect(obtenerColorHex('urgente')).toBe('#EA580C');
    expect(obtenerColorHex('proximo')).toBe('#D97706');
    expect(obtenerColorHex('vigilar')).toBe('#2563EB');
    expect(obtenerColorHex('tranquilo')).toBe('#16A34A');
    expect(obtenerColorHex('completado')).toBe('#9CA3AF');
  });

  it('debería retornar gris para color desconocido', () => {
    expect(obtenerColorHex('desconocido')).toBe('#9CA3AF');
  });
});

describe('obtenerLabelColor', () => {
  it('debería retornar label en español', () => {
    expect(obtenerLabelColor('vencido')).toBe('Vencido');
    expect(obtenerLabelColor('urgente')).toBe('Urgente');
    expect(obtenerLabelColor('tranquilo')).toBe('Tranquilo');
  });
});
