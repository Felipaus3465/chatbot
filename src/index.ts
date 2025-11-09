import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { handleMessage } from './handlers/messageHandler.js';

const { Client, LocalAuth } = pkg;

// Inicializa el cliente con autenticación local (se guardará en session.json)
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './session' // carpeta donde se guarda la sesión
  })
});

// Evento: cuando se genera el código QR
client.on('qr', (qr: string) => {
  console.log('📲 Escanea este código QR con tu WhatsApp:');
  qrcode.generate(qr, { small: true });
});

// Evento: cuando se inicia sesión correctamente
client.on('ready', () => {
  console.log('✅ Bot de WhatsApp iniciado correctamente');
});

// Evento: cuando llega un mensaje
client.on('message', (message: any) => handleMessage(client, message));

// Inicia el cliente
client.initialize();

// Mantiene el proceso vivo (Render lo necesita)
const PORT = process.env.PORT || 3000;
import http from 'http';
http.createServer((_, res) => res.end('Bot de WhatsApp activo')).listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
