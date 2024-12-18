// Inicializar el mapa con el fondo blanco y negro
const map = L.map('map').setView([51.505, -0.09], 2);  // Centrado en coordenadas globales, puedes ajustarlas

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

// Habilitar el zoom con la rueda del ratón
map.scrollWheelZoom.enable();

// Hacer que el mapa se pueda arrastrar con el click derecho
map.dragging.enable();

// Cambiar el cursor cuando se está arrastrando el mapa
map.on('mousedown', function() {
    map.getContainer().style.cursor = 'grabbing';
});

map.on('mouseup', function() {
    map.getContainer().style.cursor = 'grab';
});
