const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');

const app = express();
const port = 3000;

let ipQueue = [];

// Configuración de RabbitMQ
const rabbitmqUrl = 'amqp://localhost'; // URL de RabbitMQ
const queue = 'ipQueue'; // Nombre de la cola

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(bodyParser.json());

// Ruta para recibir las IPs y agregarlas a la cola de RabbitMQ
app.post('/send-location', (req, res) => {
  const { ip, country, region, city, latitude, longitude } = req.body;

  // Conectar a RabbitMQ y enviar el mensaje
  amqp.connect(rabbitmqUrl, (err, conn) => {
    if (err) {
      console.error('Error al conectar a RabbitMQ:', err);
      return res.status(500).send('Error al conectar a RabbitMQ');
    }

    conn.createChannel((err, channel) => {
      if (err) {
        console.error('Error al crear el canal de RabbitMQ:', err);
        return res.status(500).send('Error al crear el canal');
      }

      // Asegurarse de que la cola existe
      channel.assertQueue(queue, { durable: false });

      // Enviar el mensaje a la cola
      const message = JSON.stringify({ ip, country, region, city, latitude, longitude });
      channel.sendToQueue(queue, Buffer.from(message));
      console.log(`IP ${ip} enviada a la cola`);

      setTimeout(() => { conn.close(); }, 500);
    });
  });

  res.send('Ubicación recibida y enviada a la cola.');
});

// Ruta para procesar la cola de IPs
app.get('/process-queue', (req, res) => {
  amqp.connect(rabbitmqUrl, (err, conn) => {
    if (err) {
      console.error('Error al conectar a RabbitMQ:', err);
      return res.status(500).send('Error al conectar a RabbitMQ');
    }

    conn.createChannel((err, channel) => {
      if (err) {
        console.error('Error al crear el canal de RabbitMQ:', err);
        return res.status(500).send('Error al crear el canal');
      }

      // Asegurarse de que la cola existe
      channel.assertQueue(queue, { durable: false });

      // Consumir mensajes de la cola
      channel.consume(queue, (msg) => {
        const ipData = JSON.parse(msg.content.toString());
        console.log('Procesando IP:', ipData);

        // Aquí puedes agregar la lógica para procesar la IP (guardar en DB, etc.)
        channel.ack(msg); // Confirmar que el mensaje ha sido procesado
      }, { noAck: false });
    });
  });

  res.send('Esperando mensajes en la cola...');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
