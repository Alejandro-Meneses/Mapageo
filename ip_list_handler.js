// Lista de IPs que se usarán para mostrar en el mapa
const ipList = [
    "8.8.8.8", 
    "1.1.1.1", 
    "208.67.222.222", 
    "185.228.168.9", 
    "64.6.65.6",
    "220.40.0.0",
    "110.20.0.1",
    "87.37.0.1",
    "102.177.191.0" 
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
  