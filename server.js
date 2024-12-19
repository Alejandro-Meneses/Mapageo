const amqp = require('amqplib');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'Mapa';

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

async function startRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME);

    console.log(`Esperando mensajes en la cola "${QUEUE_NAME}"...`);

    channel.consume(QUEUE_NAME, (message) => {
      if (message !== null) {
        const content = message.content.toString();
        console.log('Mensaje recibido:', content);

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(content);
          }
        });

        channel.ack(message);
      }
    });
  } catch (error) {
    console.error('Error al conectar a RabbitMQ:', error);
  }
}

server.listen(3000, () => {
  console.log('Servidor WebSocket escuchando en http://localhost:3000');
  startRabbitMQ();
});