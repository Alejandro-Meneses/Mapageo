// script.js

// Importar la función fetchLocations desde send.js
import { fetchLocations } from './send.js';

// Configuración inicial
let scale = 100; // Zoom inicial
const minScale = 100; // Zoom mínimo
const maxScale = 1000; // Zoom máximo

let locations = []; // Almacena las ubicaciones de las IPs

// Selección del SVG y el tooltip
const svg = d3.select("#map");
const tooltip = d3.select("body").append("div").attr("class", "tooltip");

// Tamaño del contenedor
const container = document.getElementById("map-container");
let containerWidth = container.clientWidth;
let containerHeight = container.clientHeight;

// Configuración de la proyección dinámica
const projection = d3.geoMercator()
  .scale(scale)
  .translate([containerWidth / 2, containerHeight / 2]);

const path = d3.geoPath().projection(projection);

// Renderizar el mapa
function renderMap() {
  const geoJsonUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

  d3.json(geoJsonUrl).then((data) => {
    svg.selectAll("path").remove();

    svg.selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#333")
      .attr("stroke", "white")
      .attr("stroke-width", 0.5);

    renderLocations();
  }).catch((error) => console.error("Error al cargar el mapa:", error));
}

// Renderizar puntos de ubicación
function renderLocations() {
  svg.selectAll(".location-point").remove();

  locations.forEach((location) => {
    const [x, y] = projection(location.coordinates);
    if (x && y) {
      svg.append("circle")
        .attr("class", "location-point")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 6)
        .style("fill", "red")
        .style("stroke", "white")
        .style("stroke-width", 1)
        .on("mouseover", (event) => {
          tooltip.style("display", "block")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`)
            .html(`
              <div>
                <strong>País:</strong> ${location.country}<br>
                <strong>Provincia:</strong> ${location.region}<br>
                <strong>Ciudad:</strong> ${location.city}
              </div>
            `);
        })
        .on("mouseout", () => {
          tooltip.style("display", "none");
        });
    }
  });
}

// Inicializar el mapa y obtener ubicaciones
fetchLocations((fetchedLocations) => {
  locations = fetchedLocations;
  renderMap();
});

// Conectar con el servidor WebSocket
const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
  console.log('Conexión WebSocket establecida');
};

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Mensaje recibido del servidor:', message);

  if (message.type === 'location') {
    locations.push(message.data);
    renderLocations();
  }
};

socket.onclose = () => {
  console.log('Conexión WebSocket cerrada');
};

// Inicializar
updateContainerSize();
renderMap();

window.addEventListener("resize", updateContainerSize);
