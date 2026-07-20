import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function pulirMensaje(mensaje: string): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    return mensaje;
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Eres un asistente de contadores colombianos. Tu tarea es mejorar mensajes de recordatorio de declaraciones de renta para clientes. 

Reglas:
- Mantén un tono profesional pero amigable
- Sé conciso (máximo 150 palabras)
- Incluye: nombre del cliente, fecha de vencimiento y checklist de documentos
- Termina con una llamada a la acción clara
- NO agregues información que no esté en el mensaje original
- Responde SOLO con el mensaje mejorado, sin explicaciones`,
        },
        {
          role: "user",
          content: `Mejora este mensaje de recordatorio:\n\n${mensaje}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content ?? mensaje;
  } catch (error) {
    console.error("Error al pulir mensaje con Groq:", error);
    return mensaje;
  }
}
