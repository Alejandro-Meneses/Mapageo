// Función para enviar la IP al servidor y agregarla a la cola de RabbitMQ
function sendLocationToServer(ip, country, region, city, latitude, longitude) {
    fetch('http://localhost:3000/send-location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ip, country, region, city, latitude, longitude }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Ubicación enviada correctamente:', data);
      })
      .catch((error) => {
        console.error('Error al enviar la IP al servidor:', error);
      });
  }
  
  // Ejemplo de IPs que quieres enviar (puedes sustituirlas con las IPs dinámicas que tengas)
  const ips = [
    { ip: '87.218.184.39', country: 'España', region: 'Madrid', city: 'Madrid', latitude: 40.4168, longitude: -3.7038 },
    { ip: '8.8.8.8', country: 'EE.UU.', region: 'California', city: 'Mountain View', latitude: 37.4056, longitude: -122.0775 }
  ];
  
  // Enviar todas las IPs al servidor
  ips.forEach((location) => {
    sendLocationToServer(location.ip, location.country, location.region, location.city, location.latitude, location.longitude);
  });
  