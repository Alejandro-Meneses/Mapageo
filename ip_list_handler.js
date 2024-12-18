// Archivo: ip_list_handler.js
const ipList = ["8.8.8.8", "1.1.1.1", "208.67.222.222", "185.228.168.9", "64.6.65.6"];

async function fetchLocations(callback) {
  const fetchedLocations = [];

  for (const ip of ipList) {
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await response.json();

      if (data.status === "success" && data.lon && data.lat) {
        fetchedLocations.push({
          ip: data.query,
          coordinates: [data.lon, data.lat],
          country: data.country || "Desconocido",
          region: data.regionName || "Desconocido",
          city: data.city || "Desconocido",
        });
      } else {
        console.error(`No se pudo obtener datos válidos para la IP: ${ip}`);
      }
    } catch (error) {
      console.error(`Error al obtener datos de la IP ${ip}:`, error);
    }
  }

  console.log("Ubicaciones obtenidas:", fetchedLocations);
  callback(fetchedLocations);
}