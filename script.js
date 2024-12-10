// Crea el mapa
const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
// Función para agregar un marcador al mapa
function agregarMarcador(lat, lon, popupInfo) {
  const marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup(popupInfo).openPopup();
}

// Cargar ubicaciones guardadas en Local Storage y mostrarlas en el mapa
function cargarMarcadoresGuardados() {
  const visitasGuardadas = JSON.parse(localStorage.getItem('visitas')) || [];
  visitasGuardadas.forEach(visita => {
    agregarMarcador(visita.lat, visita.lon, `
      <b>País:</b> ${visita.pais}<br>
      <b>Ciudad:</b> ${visita.ciudad}
    `);
  });
}

// Guardar una nueva visita en Local Storage
function guardarVisita(visita) {
  const visitas = JSON.parse(localStorage.getItem('visitas')) || [];
  visitas.push(visita);
  localStorage.setItem('visitas', JSON.stringify(visitas));
}

// Obtener la geolocalización del usuario actual y agregar un marcador
fetch('http://ip-api.com/json/')
  .then(response => response.json())
  .then(data => {
    const { lat, lon, city, country } = data;

    // Crear la información de la visita
    const nuevaVisita = {
      pais: country,
      ciudad: city,
      lat: lat,
      lon: lon
    };

    guardarVisita(nuevaVisita);

    // Agregar marcador al mapa
    agregarMarcador(lat, lon, `
      <b>País:</b> ${country}<br>
      <b>Ciudad:</b> ${city}
    `);

    
  })
  .catch(error => console.error('Error al obtener datos de geolocalización:', error));

cargarMarcadoresGuardados();
