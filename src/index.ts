import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { handleMessage } from "./handlers/messageHandler.js";

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "./src/session" }),
});

client.on("qr", (qr) => {
  console.log("📱 Escanea este QR con tu WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log(" Cliente de WhatsApp conectado y listo");
});

client.on("message", async (message) => {
  await handleMessage(client, message);
});

client.initialize();
