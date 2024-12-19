const amqp = require('amqplib');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'Mapa';

// WebSocket - Conexión del cliente
wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  // Manejo de desconexión del cliente
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });

  // Enviar un mensaje de bienvenida al cliente
  ws.send(JSON.stringify({ message: 'Conexión WebSocket establecida' }));
});

// Función para conectar con RabbitMQ y escuchar mensajes
async function startRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME);
    console.log(`Esperando mensajes en la cola "${QUEUE_NAME}"...`);

    // Escuchar mensajes de la cola de RabbitMQ
    channel.consume(QUEUE_NAME, (message) => {
      if (message !== null) {
        const content = message.content.toString();
        console.log('Mensaje recibido desde RabbitMQ:', content);

        // Enviar el mensaje a todos los clientes WebSocket conectados
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(content); // Enviar el mensaje a cada cliente
          }
        });

        channel.ack(message); // Confirmar que el mensaje fue procesado
      }
    });
  } catch (error) {
    console.error('Error al conectar a RabbitMQ:', error);
  }
}

// Iniciar servidor WebSocket y RabbitMQ
server.listen(3000, () => {
  console.log('Servidor WebSocket escuchando en http://localhost:3000');
  startRabbitMQ(); // Iniciar conexión a RabbitMQ
});
