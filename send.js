function sendLocationToServer(locationData) {
    fetch('http://localhost:3000/send-location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationData),
    })
    .then(response => response.text())
    .then(data => console.log('Respuesta del servidor:', data))
    .catch(error => console.error('Error al enviar la ubicación:', error));
  }
  
  // Suponiendo que `location` contiene la información de la ubicación del usuario
  const location = {
    ip: '192.168.1.1',
    country: 'España',
    region: 'Madrid',
    city: 'Madrid',
    latitude: 40.4168,
    longitude: -3.7038,
  };
  
  // Enviar la ubicación
  sendLocationToServer(location);
  