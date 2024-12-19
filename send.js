// send.js

// Función para obtener la IP pública del cliente
function getClientIP() {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        console.log('IP del cliente:', data.ip);
        // Llamar a la función para enviar la ubicación con la IP
        getUserLocation(data.ip);
      })
      .catch(error => {
        console.error('Error al obtener la IP:', error);
      });
  }
  
  // Función para obtener la ubicación del usuario
  function getUserLocation(clientIP) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const locationData = {
          ip: clientIP,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        console.log('Ubicación del usuario:', locationData);
        sendLocationToServer(locationData); // Enviar ubicación al servidor
      }, function(error) {
        console.error('Error al obtener la ubicación:', error);
      });
    } else {
      console.error('La geolocalización no está disponible en este navegador.');
    }
  }
  
  // Función para enviar la ubicación y la IP al servidor
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
  
  // Llamar a la función para obtener la IP y la ubicación
  getClientIP();
  