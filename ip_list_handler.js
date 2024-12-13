// Lista de IPs que se usarán para mostrar en el mapa
const ipList = [
    "8.8.8.8", // Google Public DNS
    "1.1.1.1", // Cloudflare DNS
    "208.67.222.222", // OpenDNS
    "185.228.168.9", // CleanBrowsing
    "64.6.65.6" // Verisign
  ];
  
  // Función para obtener la ubicación de una lista de IPs
  async function fetchLocations(ipList, renderLocationsCallback) {
    const locations = [];
  
    for (const ip of ipList) {
      try {
        const locationResponse = await fetch(`http://ip-api.com/json/${ip}`);
        const locationData = await locationResponse.json();
  
        if (locationData.status === "success") {
          const userLocation = {
            ip: locationData.query,
            coordinates: [locationData.lon, locationData.lat],
            country: locationData.country,
            region: locationData.regionName,
            city: locationData.city,
            zip: locationData.zip,
            isp: locationData.isp,
          };
  
          // Agregar la ubicación a la lista
          locations.push(userLocation);
        } else {
          console.error(`No se pudo obtener la ubicación para la IP ${ip}`);
        }
      } catch (error) {
        console.error(`Error al procesar la IP ${ip}:`, error);
      }
    }
  
    // Llamar al callback con las ubicaciones
    renderLocationsCallback(locations);
  }
  