// Función para obtener la IP del usuario y su ubicación
async function fetchUserLocation() {
    try {
      // Obtener la IP del usuario
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const { ip } = await ipResponse.json();
  
      // Obtener la ubicación basada en la IP
      const locationResponse = await fetch(`http://ip-api.com/json/${ip}`);
      const locationData = await locationResponse.json();
  
      // Procesar los datos de ubicación
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
  
        // Renderizar el punto en el mapa
        renderLocationPoint(userLocation);
      } else {
        console.error("No se pudo obtener la ubicación de la IP.");
      }
    } catch (error) {
      console.error("Error al obtener la IP o la ubicación:", error);
    }
  }
  
  // Función para renderizar el punto en el mapa
  function renderLocationPoint(location) {
    const svg = d3.select("#map");
    const tooltip = d3.select(".tooltip");
  
    svg.append("circle")
      .attr("class", "location-point")
      .attr("cx", () => projection(location.coordinates)[0])
      .attr("cy", () => projection(location.coordinates)[1])
      .attr("r", 5)
      .on("mouseover", (event) => {
        tooltip
          .style("display", "block")
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`)
          .html(`
            <strong>IP:</strong> ${location.ip}<br>
            <strong>País:</strong> ${location.country}<br>
            <strong>Región:</strong> ${location.region}<br>
            <strong>Ciudad:</strong> ${location.city}<br>
            <strong>Código Postal:</strong> ${location.zip}<br>
            <strong>ISP:</strong> ${location.isp}
          `);
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      });
  }
  
  // Llamar a la función para cargar la ubicación del usuario al cargar la página
  fetchUserLocation();
  