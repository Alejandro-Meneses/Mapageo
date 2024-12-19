const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://localhost'; // URL de RabbitMQ
const QUEUE_NAME = 'map_updates'; // Nombre de la cola

// Ejemplo de mensajes con datos de diferentes ubicaciones
const messages = [
  {
    type: 'location',
    data: {
      coordinates: [-99.1332, 19.4326], // Ciudad de México
      country: 'México',
      region: 'Ciudad de México',
      city: 'Ciudad de México'
    }
  },
  {
    type: 'location',
    data: {
      coordinates: [-74.006, 40.7128], // Nueva York
      country: 'Estados Unidos',
      region: 'Nueva York',
      city: 'Nueva York'
    }
  },
  {
    type: 'location',
    data: {
      coordinates: [2.3522, 48.8566], // París
      country: 'Francia',
      region: 'Île-de-France',
      city: 'París'
    }
  },
  {
    type: 'location',
    data: {
      coordinates: [139.6917, 35.6895], // Tokio
      country: 'Japón',
      region: 'Kantō',
      city: 'Tokio'
    }
  },
  {
    type: 'location',
    data: {
      coordinates: [151.2093, -33.8688], // Sídney
      country: 'Australia',
      region: 'Nueva Gales del Sur',
      city: 'Sídney'
    }
  }
];

async function sendMessages() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Asegurarse de que la cola exista
    await channel.assertQueue(QUEUE_NAME);

    // Enviar cada mensaje
    messages.forEach((message) => {
      channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
      console.log('Mensaje enviado:', message);
    });

    // Cerrar la conexión después de enviar los mensajes
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error('Error al enviar los mensajes:', error);
  }
}

sendMessages();
