const socket = new WebSocket('ws://localhost:3000'); // Conectar al servidor WebSocket

// Mensajes de ejemplo
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
  // Más mensajes aquí
];

socket.onopen = () => {
  console.log('Conexión WebSocket establecida');
  
  // Enviar mensajes al servidor
  messages.forEach((message) => {
    socket.send(JSON.stringify(message));
    console.log('Mensaje enviado:', message);
  });
};

socket.onmessage = (event) => {
  console.log('Mensaje recibido:', event.data);
};

socket.onclose = () => {
  console.log('Conexión WebSocket cerrada');
};
