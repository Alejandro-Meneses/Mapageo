const amqp = require('amqplib');
const WebSocket = require('ws');

const RABBITMQ_URL = 'amqp://localhost';
const queueName = 'visitas';

// Crear un servidor WebSocket
const wss = new WebSocket.Server({ port: 8080 });
console.log('Servidor WebSocket escuchando en el puerto 8080');

// Consumir mensajes de RabbitMQ y retransmitir por WebSocket
async function startConsumer() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);

    console.log(`Esperando mensajes en la cola "${queueName}"...`);

    channel.consume(queueName, (message) => {
      if (message !== null) {
        const visita = JSON.parse(message.content.toString());
        console.log('Mensaje recibido:', visita);

        // Enviar el mensaje a todos los clientes WebSocket conectados
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(visita));
          }
        });

        channel.ack(message); // Confirmar el mensaje como procesado
      }
    });
  } catch (error) {
    console.error('Error al consumir mensajes:', error);
  }
}

startConsumer();
