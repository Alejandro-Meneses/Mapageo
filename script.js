// Conexión al WebSocket del servidor
const socket = new WebSocket('ws://localhost:8080'); // Dirección del servidor WebSocket

// Cuando se abre la conexión WebSocket
socket.onopen = function() {
  console.log('Conexión WebSocket establecida');
};

// Cuando se recibe un mensaje desde el servidor WebSocket
socket.onmessage = function(event) {
  const data = JSON.parse(event.data);
  
  // Comprobar si los datos contienen la propiedad 'locations'
  if (data.locations && Array.isArray(data.locations)) {
    locations = data.locations; // Actualizar las ubicaciones
    renderMap(); // Volver a renderizar el mapa con las nuevas ubicaciones
  }
};

// Cuando ocurre un error en la conexión WebSocket
socket.onerror = function(error) {
  console.error('Error en WebSocket:', error);
};

// Cuando se cierra la conexión WebSocket
socket.onclose = function() {
  console.log('Conexión WebSocket cerrada');
};

// Arreglo de ubicaciones que se van a mostrar en el mapa
let locations = [];

// Función para inicializar y renderizar el mapa (usando Leaflet.js en este ejemplo)
let map;
function renderMap() {
  if (typeof L !== 'undefined') {
    // Inicializar el mapa solo si no está inicializado
    if (!map) {
      map = L.map('map').setView([19.4326, -99.1332], 13); // Coordenadas iniciales (Ciudad de México)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    }

    // Limpiar los marcadores anteriores
    map.eachLayer(function(layer) {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Agregar nuevos marcadores al mapa con las ubicaciones recibidas
    locations.forEach(location => {
      const { coordinates, country, region, city } = location;
      L.marker([coordinates[1], coordinates[0]])
        .addTo(map)
        .bindPopup(`<b>${city}</b><br>${region}, ${country}`);
    });
  }
}

// Función para enviar una solicitud al servidor (puedes llamarla si necesitas obtener ubicaciones)
async function fetchLocations() {
  try {
    const response = await fetch('/api/locations'); // Ruta para obtener las ubicaciones
    const data = await response.json();
    
    if (data.locations) {
      locations = data.locations; // Actualizar el arreglo de ubicaciones
      renderMap(); // Volver a renderizar el mapa con las nuevas ubicaciones
    }
  } catch (error) {
    console.error('Error al obtener las ubicaciones:', error);
  }
}

// Llamar a la función para obtener ubicaciones al cargar la página (opcional)
fetchLocations();
