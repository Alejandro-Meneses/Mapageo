// Dimensiones y escala inicial del mapa
let scale = 200; // Escala inicial
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

// Actualizar dimensiones dinámicamente
function updateContainerSize() {
  containerWidth = container.clientWidth;
  containerHeight = container.clientHeight;

  projection.translate([containerWidth / 2, containerHeight / 2]);
  renderMap();
}

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

// Renderizar puntos de IP
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

// Manejar zoom centrado
svg.on("wheel", (event) => {
  event.preventDefault();

  const zoomStep = 20;
  const oldScale = scale;

  // Ajustar escala con límites
  scale = Math.max(minScale, Math.min(maxScale, scale + (event.deltaY < 0 ? zoomStep : -zoomStep)));

  // Centrar proyección nuevamente
  projection.scale(scale).translate([containerWidth / 2, containerHeight / 2]);

  renderMap();
});

// Redimensionar la ventana
window.addEventListener("resize", () => {
  updateContainerSize();
});

// Inicializar el mapa y obtener ubicaciones
fetchLocations((fetchedLocations) => {
  locations = fetchedLocations;
  renderMap();
});