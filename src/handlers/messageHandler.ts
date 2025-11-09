import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { isHoliday, isWorkDay, isWorkHour } from './scheduleHandler.js';

const filePath = path.resolve('./lastReply.json');
const today = new Date().toISOString().slice(0, 10);

// Cargar registro de chats respondidos hoy
let lastReply: Record<string, boolean> = {};
if (fs.existsSync(filePath)) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (data.date === today && data.chats) {
    lastReply = data.chats;
  }
}

// Guardar chats del día
function saveLastReply() {
  fs.writeFileSync(filePath, JSON.stringify({ date: today, chats: lastReply }), 'utf-8');
}

// Función para enviar mensaje con WhatsApp Cloud API
async function sendMessage(to: string, text: string) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  await axios.post(
    `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      text: { body: text },
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

// Función principal que maneja el mensaje entrante
export async function handleMessage(message: any) {
  const chatId = message.from;

  // Evita duplicar respuestas por chat/día
  if (lastReply[chatId]) return;

  let reply = '';

  if (isHoliday()) {
    reply = '🎉 Hoy es un día feriado. Te atenderemos el próximo día hábil.';
  } else if (!isWorkDay()) {
    reply = '📅 No trabajamos fines de semana. Nuestro horario es de lunes a viernes, 8 a.m. a 4 p.m.';
  } else if (!isWorkHour()) {
    reply = '⏰ Estamos fuera del horario laboral. Te responderemos mañana.';
  } else {
    reply =
      '👋 ¡Bienvenido a la clínica! Por favor indique:\n• Nombre completo\n• Servicio que desea\n• Fecha y hora deseadas.';
  }

  await sendMessage(chatId, reply);

  // Guardamos que ya respondimos hoy
  lastReply[chatId] = true;
  saveLastReply();
}
