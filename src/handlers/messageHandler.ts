import fs from "fs";
import path from "path";
import axios from "axios";
import { isHoliday, isWorkDay, isWorkHour } from "./scheduleHandler.js";

const filePath = path.resolve("./lastReply.json");

// Tipado del JSON
interface LastReplyData {
  date: string;
  chats: Record<string, boolean>;
}

// Obtener fecha de hoy AAAA-MM-DD
function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

// Cargar o inicializar
function loadReplies(): LastReplyData {
  if (!fs.existsSync(filePath)) {
    return { date: getToday(), chats: {} };
  }
  const data: LastReplyData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (data.date !== getToday()) {
    const newData: LastReplyData = { date: getToday(), chats: {} };
    fs.writeFileSync(filePath, JSON.stringify(newData), "utf-8");
    return newData;
  }
  return data;
}

// Guardar JSON
function saveReplies(data: LastReplyData) {
  fs.writeFileSync(filePath, JSON.stringify(data), "utf-8");
}

// Enviar mensaje con Cloud API
async function sendMessage(to: string, text: string): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.error("⚠️ WHATSAPP_TOKEN o PHONE_NUMBER_ID no configurado");
    return;
  }

  await axios.post(
    `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      text: { body: text },
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

// Función principal para manejar mensajes entrantes
export async function handleMessage(message: { from: string }) {
  const data = loadReplies();
  const chatId = message.from;

  if (data.chats[chatId]) return;

  let reply = "";

  if (isHoliday()) {
    reply = "🎉 Hoy es un día feriado. Te atenderemos el próximo día hábil.";
  } else if (!isWorkDay()) {
    reply = "📅 No trabajamos fines de semana. Nuestro horario es de lunes a viernes, 8 a.m. a 4 p.m.";
  } else if (!isWorkHour()) {
    reply = "⏰ Estamos fuera del horario laboral. Te responderemos mañana.";
  } else {
    reply = "👋 ¡Bienvenido a la clínica! Por favor indique:\n• Nombre completo\n• Servicio que desea\n• Fecha y hora deseadas.";
  }

  await sendMessage(chatId, reply);

  data.chats[chatId] = true;
  saveReplies(data);
}
