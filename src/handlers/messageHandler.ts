import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import fs from 'fs';

const { Client, LocalAuth, MessageMedia } = pkg;

// Inicializa el cliente con autenticación local
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

// Muestra el QR para iniciar sesión
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('Escanea este código QR con tu teléfono.');
});

// Listo
client.on('ready', () => {
  console.log('✅ Cliente conectado correctamente.');
});

// 📩 Manejador de mensajes
client.on('message', async (message) => {
  console.log(`📨 Mensaje de ${message.from}: ${message.body}`);

  if (message.body.toLowerCase() === 'hola') {
    await message.reply('👋 ¡Hola! ¿En qué puedo ayudarte?');
  }

  // Enviar una imagen
  if (message.body.toLowerCase() === 'foto') {
    const media = MessageMedia.fromFilePath('./ejemplo.jpg');
    await client.sendMessage(message.from, media);
  }
});

// Inicia el cliente
client.initialize();
