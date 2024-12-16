// Configuración de Leaflet para mostrar el mapa
const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Función para agregar un marcador al mapa
function agregarMarcador(lat, lon, popupInfo) {
  const marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup(popupInfo).openPopup();
}

// WebSocket para recibir datos en tiempo real
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
  console.log('Conexión WebSocket abierta');
};

socket.onmessage = (event) => {
  console.log('Conexión WebSocket abierta');

  const visita = JSON.parse(event.data);

  // Agregar marcador al mapa
  agregarMarcador(visita.lat, visita.lon, `
    <b>País:</b> ${visita.pais}<br>
    <b>Ciudad:</b> ${visita.ciudad}
  `);
  console.log('Nueva visita recibida:', visita);
};

socket.onerror = (error) => {
  console.error('Error en WebSocket:', error);
};

socket.onclose = () => {
  console.log('Conexión WebSocket cerrada');
};
