// Lista de IPs con sus ubicaciones (esto sería dinámico en un caso real, pero aquí es estático para la demostración)
const ipData = [
  { ip: '192.168.1.1', lat: 51.505, lon: -0.09, country: 'Reino Unido', province: 'Londres', city: 'Londres' },
  { ip: '192.168.1.2', lat: 48.8566, lon: 2.3522, country: 'Francia', province: 'Île-de-France', city: 'París' },
  { ip: '192.168.1.3', lat: 40.7128, lon: -74.0060, country: 'EE.UU.', province: 'Nueva York', city: 'Nueva York' }
];

// Añadir los puntos de las IPs al mapa después de que se cargue el mapa
window.onload = function() {
  ipData.forEach(data => {
      const marker = L.marker([data.lat, data.lon]).addTo(map);

      // Mostrar información al pasar el ratón por encima
      marker.bindPopup(`
          <strong>IP:</strong> ${data.ip}<br>
          <strong>País:</strong> ${data.country}<br>
          <strong>Provincia:</strong> ${data.province}<br>
          <strong>Ciudad:</strong> ${data.city}
      `);
  });
};