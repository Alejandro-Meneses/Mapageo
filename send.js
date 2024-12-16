const amqp = require('amqplib');
 
const RABBITMQ_URL = 'amqp://localhost';
const queueName = 'visitas';

async function sendtoQueue(visita) {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel= await connection.createChannel();
        await channel.assertQueue(queueName);
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(visita)));
        console.log('Mensaje enviado:', visita);
        console.log(`Visita enviada a la cola ${queueName}`);
    } catch (error) {
        console.log(error);
    }
    
}

const simulacion = [
    {
        pais: 'Argentina',
        ciudad: 'Buenos Aires',
        lat: -34.603722,
        lon: -58.381592
    },
    {
        pais: 'España',
        ciudad: 'Cáceres',
        lat: 39.4667,
        lon: -6.3667
    },
    {
        pais: 'Francia',
        ciudad: 'París',
        lat: 48.8566,
        lon: 2.3522,
    }
]

simulacion.forEach((visita, index) => {
    setTimeout(() => {
        sendtoQueue(visita);
        
    }, index * 1000)
})