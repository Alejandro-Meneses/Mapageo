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

// Variables para arrastrar el mapa
let isDragging = false;
let startX, startY; // Posición inicial del ratón
let startTranslateX, startTranslateY; // Posición inicial de la proyección

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

// Manejar zoom en la dirección del ratón
svg.on("wheel", (event) => {
  event.preventDefault();

  const zoomStep = 20;
  const oldScale = scale;

  // Ajustar escala con límites
  scale = Math.max(minScale, Math.min(maxScale, scale + (event.deltaY < 0 ? zoomStep : -zoomStep)));

  // Calcular posición relativa del ratón
  const mouseX = event.clientX - container.getBoundingClientRect().left;
  const mouseY = event.clientY - container.getBoundingClientRect().top;

  // Obtener las coordenadas actuales de la proyección
  const [currentX, currentY] = projection.translate();

  // Calcular nuevas coordenadas para centrar el zoom en el ratón
  const factor = scale / oldScale;
  const newX = currentX - (mouseX - currentX) * (factor - 1);
  const newY = currentY - (mouseY - currentY) * (factor - 1);

  // Actualizar la proyección
  projection.scale(scale).translate([newX, newY]);

  enforceBoundaries();
  renderMap();
});

// Manejar arrastre del mapa
svg.on("mousedown", (event) => {
  isDragging = true;
  startX = event.clientX;
  startY = event.clientY;

  const [currentX, currentY] = projection.translate();
  startTranslateX = currentX;
  startTranslateY = currentY;

  svg.style("cursor", "grabbing");
});

svg.on("mousemove", (event) => {
  if (isDragging) {
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    const newX = startTranslateX + dx;
    const newY = startTranslateY + dy;

    projection.translate([newX, newY]);
    enforceBoundaries();
    renderMap();
  }
});

svg.on("mouseup", () => {
  isDragging = false;
  svg.style("cursor", "default");
});

svg.on("mouseleave", () => {
  isDragging = false;
  svg.style("cursor", "default");
});

// Restringir los límites del mapa
function enforceBoundaries() {
  const [translateX, translateY] = projection.translate();

  const scaledWidth = containerWidth * (scale / minScale);
  const scaledHeight = containerHeight * (scale / minScale);

  const maxX = containerWidth / 2;
  const minX = containerWidth / 2 - scaledWidth;
  const maxY = containerHeight / 2;
  const minY = containerHeight / 2 - scaledHeight;

  const clampedX = Math.max(minX, Math.min(maxX, translateX));
  const clampedY = Math.max(minY, Math.min(maxY, translateY));

  projection.translate([clampedX, clampedY]);
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