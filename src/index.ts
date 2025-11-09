import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { handleMessage } from "./handlers/messageHandler.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Webhook GET (verificación)
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook POST (mensajes entrantes)
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const messages = changes?.value?.messages;

  if (messages) {
    for (const message of messages) {
      await handleMessage(message);
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
