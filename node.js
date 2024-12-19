const amqp = require('amqplib');
const express = require('express');
const app = express();
const PORT = 3000;

// Conectar a RabbitMQ
async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'user_locations';

  await channel.assertQueue(queue, { durable: false });
  console.log(`Servidor conectado a RabbitMQ, esperando mensajes en ${queue}`);

  // Consumiendo los mensajes de la cola
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const userLocation = JSON.parse(msg.content.toString());
      console.log('Recibido:', userLocation);
      channel.ack(msg); // Confirmar que el mensaje ha sido procesado
    }
  });
}

connectRabbitMQ();

// Servidor HTTP básico para enviar mensajes
app.use(express.json());

app.post('/send-location', (req, res) => {
  const userLocation = req.body;
  sendToQueue(userLocation);
  res.send('Ubicación enviada');
});

async function sendToQueue(userLocation) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'user_locations';

  await channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(userLocation)));
  console.log('Enviado:', userLocation);

  setTimeout(() => {
    connection.close();
  }, 500);
}

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
