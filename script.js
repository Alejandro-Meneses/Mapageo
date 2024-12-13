// Dimensiones y escala inicial
let scale = 150; // Escala inicial del mapa
const minScale = 100; // Escala mínima permitida
const maxScale = 800; // Escala máxima permitida

let translate = [0, 0]; // Translación inicial del mapa
let isDragging = false; // Bandera para rastrear si el usuario está arrastrando
let startPoint = [0, 0]; // Posición inicial del ratón al hacer clic

// Arreglo global para almacenar las ubicaciones
let locations = [];

// Seleccionar el elemento SVG y definir sus dimensiones
const svg = d3.select("#map");
const mapContainer = document.getElementById("map-container");
const width = parseInt(svg.style("width"));
const height = parseInt(svg.style("height"));

// Crear un tooltip
const tooltip = d3.select("body").append("div").attr("class", "tooltip");

// Proyección y trayectoria
const projection = d3.geoMercator()
  .scale(scale)
  .translate([width / 2, height / 2]);
let path = d3.geoPath().projection(projection);

// Función para renderizar el mapa
function renderMap() {
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {
    svg.selectAll("path").remove();

    svg.selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "land")
      .attr("fill", "black");

    renderLocations(); // Renderizar los puntos rojos después del mapa
  });
}

// Función para renderizar todas las ubicaciones almacenadas
function renderLocations() {
  svg.selectAll(".location-point").remove(); // Limpia puntos previos

  locations.forEach(location => {
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
  });
}

// Manejo de los botones de zoom
document.getElementById("zoom-in").addEventListener("click", () => {
  if (scale < maxScale) {
    scale += 20;
    projection.scale(scale);
    renderMap();
  }
});

document.getElementById("zoom-out").addEventListener("click", () => {
  if (scale > minScale) {
    scale -= 20;
    projection.scale(scale);
    renderMap();
  }
});

// Agregar funcionalidad de drag and pan
svg.on("mousedown", (event) => {
  isDragging = true;
  startPoint = [event.clientX, event.clientY];
  mapContainer.classList.add("grabbing");
});

svg.on("mousemove", (event) => {
  if (isDragging) {
    const dx = event.clientX - startPoint[0];
    const dy = event.clientY - startPoint[1];

    translate[0] += dx;
    translate[1] += dy;

    projection.translate([
      width / 2 + translate[0],
      height / 2 + translate[1],
    ]);

    renderMap();
    startPoint = [event.clientX, event.clientY];
  }
});

svg.on("mouseup", () => {
  isDragging = false;
  mapContainer.classList.remove("grabbing");
});

svg.on("mouseleave", () => {
  isDragging = false;
  mapContainer.classList.remove("grabbing");
});

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

      // Agregar la ubicación al arreglo global
      locations.push(userLocation);

      // Renderizar los puntos nuevamente
      renderLocations();
    } else {
      console.error("No se pudo obtener la ubicación de la IP.");
    }
  } catch (error) {
    console.error("Error al obtener la IP o la ubicación:", error);
  }
}

// Renderizado inicial del mapa
renderMap();

// Obtener y mostrar la ubicación del usuario
fetchUserLocation();
