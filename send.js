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
    { pais: 'Argentina', ciudad: 'Buenos Aires', lat: -34.603722, lon: -58.381592 },
    { pais: 'España', ciudad: 'Cáceres', lat: 39.4667, lon: -6.3667 },
    { pais: 'Francia', ciudad: 'París', lat: 48.8566, lon: 2.3522 },
    { pais: 'Estados Unidos', ciudad: 'Nueva York', lat: 40.7128, lon: -74.006 },
    { pais: 'Reino Unido', ciudad: 'Londres', lat: 51.5074, lon: -0.1278 },
    { pais: 'Japón', ciudad: 'Tokio', lat: 35.6895, lon: 139.6917 },
    { pais: 'Australia', ciudad: 'Sídney', lat: -33.8688, lon: 151.2093 },
    { pais: 'Alemania', ciudad: 'Berlín', lat: 52.52, lon: 13.405 },
    { pais: 'Brasil', ciudad: 'Río de Janeiro', lat: -22.9068, lon: -43.1729 },
    { pais: 'India', ciudad: 'Nueva Delhi', lat: 28.6139, lon: 77.209 },
    { pais: 'China', ciudad: 'Pekín', lat: 39.9042, lon: 116.4074 },
    { pais: 'Italia', ciudad: 'Roma', lat: 41.9028, lon: 12.4964 },
    { pais: 'México', ciudad: 'Ciudad de México', lat: 19.4326, lon: -99.1332 },
    { pais: 'Rusia', ciudad: 'Moscú', lat: 55.7558, lon: 37.6173 },
    { pais: 'Egipto', ciudad: 'El Cairo', lat: 30.0444, lon: 31.2357 },
    { pais: 'Sudáfrica', ciudad: 'Ciudad del Cabo', lat: -33.9249, lon: 18.4241 },
    { pais: 'Canadá', ciudad: 'Toronto', lat: 43.65107, lon: -79.347015 },
    { pais: 'Chile', ciudad: 'Santiago', lat: -33.4489, lon: -70.6693 },
    { pais: 'Corea del Sur', ciudad: 'Seúl', lat: 37.5665, lon: 126.978 },
    { pais: 'Turquía', ciudad: 'Estambul', lat: 41.0082, lon: 28.9784 },
    { pais: 'Indonesia', ciudad: 'Yakarta', lat: -6.2088, lon: 106.8456 },
    { pais: 'Portugal', ciudad: 'Lisboa', lat: 38.7223, lon: -9.1393 },
    { pais: 'Colombia', ciudad: 'Bogotá', lat: 4.711, lon: -74.0721 },
    { pais: 'Tailandia', ciudad: 'Bangkok', lat: 13.7563, lon: 100.5018 },
    { pais: 'Suecia', ciudad: 'Estocolmo', lat: 59.3293, lon: 18.0686 },
    { pais: 'Noruega', ciudad: 'Oslo', lat: 59.9139, lon: 10.7522 },
    { pais: 'Finlandia', ciudad: 'Helsinki', lat: 60.1695, lon: 24.9354 },
    { pais: 'Suiza', ciudad: 'Zúrich', lat: 47.3769, lon: 8.5417 },
    { pais: 'Nueva Zelanda', ciudad: 'Wellington', lat: -41.2865, lon: 174.7762 },
    { pais: 'Perú', ciudad: 'Lima', lat: -12.0464, lon: -77.0428 },
    { pais: 'Venezuela', ciudad: 'Caracas', lat: 10.4806, lon: -66.9036 },
    { pais: 'Irlanda', ciudad: 'Dublín', lat: 53.3498, lon: -6.2603 },
    { pais: 'Filipinas', ciudad: 'Manila', lat: 14.5995, lon: 120.9842 },
    { pais: 'Pakistán', ciudad: 'Karachi', lat: 24.8607, lon: 67.0011 },
    { pais: 'Arabia Saudita', ciudad: 'Riad', lat: 24.7136, lon: 46.6753 },
    { pais: 'Malasia', ciudad: 'Kuala Lumpur', lat: 3.139, lon: 101.6869 },
    { pais: 'Singapur', ciudad: 'Singapur', lat: 1.3521, lon: 103.8198 },
    { pais: 'Nigeria', ciudad: 'Lagos', lat: 6.5244, lon: 3.3792 },
    { pais: 'Kenia', ciudad: 'Nairobi', lat: -1.286389, lon: 36.817223 }
];


simulacion.forEach((visita, index) => {
    setTimeout(() => {
        sendtoQueue(visita);
        
    }, index * 1000)
})

