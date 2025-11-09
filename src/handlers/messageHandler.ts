import { Client } from "whatsapp-web.js";
import type { Message } from "whatsapp-web.js";
import { isHoliday, isWorkDay, isWorkHour } from "./scheduleHandler.js";

export async function handleMessage(client: Client, message: Message) {
  const from = message.from;
  let reply = "";

  if (isHoliday()) {
    reply = "🎉 Hoy es un día feriado. Te atenderemos el próximo día hábil.";
  } else if (!isWorkDay()) {
    reply = "📅 No trabajamos fines de semana. Nuestro horario es de lunes a viernes, 7am a 5pm.";
  } else if (!isWorkHour()) {
    reply = "⏰ Estamos fuera del horario laboral. Te responderemos mañana.";
  } else {
    reply = "👋 ¡Bienvenido a la clínica! Por favor indique:\n• Nombre completo\n• Servicio que desea (Psicología o Homeopatía)\n• Fecha y hora deseadas.";
  }

  await client.sendMessage(from, reply);
}
