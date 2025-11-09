import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { handleMessage } from './messageHandler.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Endpoint para verificación de webhook
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = 'mi_token_seguro';
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    console.log('Webhook verificado');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Endpoint para recibir mensajes entrantes
app.post('/webhook', async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const messages = value?.messages;

  if (messages) {
    for (const message of messages) {
      await handleMessage(message);
    }
  }

  res.sendStatus(200);
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
