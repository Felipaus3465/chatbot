import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { handleMessage } from './handlers/messageHandler.js';

const { Client, LocalAuth } = pkg;

// Inicializa el cliente con autenticación local
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './session' // carpeta donde se guarda la sesión
  })
});

// Evento: cuando se genera el código QR
client.on('qr', (qr) => {
  console.log('📲 Escanea este QR con WhatsApp (terminal):');

  // Genera QR más grande y escaneable
  qrcode.generate(qr, {
    small: false      // QR más grande
     // margenes mínimos para la terminal
  });
});

// Evento: cuando se inicia sesión correctamente
client.on('ready', () => {
  console.log('✅ Bot de WhatsApp iniciado correctamente');
});

// Evento: cuando llega un mensaje
client.on('message', (message) => handleMessage(client, message));

// Inicia el cliente
client.initialize();

// Mantiene el proceso activo
import http from 'http';
const PORT = process.env.PORT || 3000;
http.createServer((_, res) => res.end('Bot de WhatsApp activo')).listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
