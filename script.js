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

// Función para limitar los valores de traslación
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Agregar funcionalidad de drag and pan con límites
svg.on("mousedown", (event) => {
  isDragging = true;
  startPoint = [event.clientX, event.clientY];
  mapContainer.classList.add("grabbing");
});

svg.on("mousemove", (event) => {
  if (isDragging) {
    const dx = event.clientX - startPoint[0];
    const dy = event.clientY - startPoint[1];

    // Calcular los límites del mapa dentro del contenedor
    const mapBounds = {
      minX: -(width * (scale / 150)) + mapContainer.offsetWidth / 2,
      maxX: width * (scale / 150) - mapContainer.offsetWidth / 2,
      minY: -(height * (scale / 150)) + mapContainer.offsetHeight / 2,
      maxY: height * (scale / 150) - mapContainer.offsetHeight / 2,
    };

    // Actualizar las traslaciones con límites
    translate[0] = clamp(translate[0] + dx, mapBounds.minX, mapBounds.maxX);
    translate[1] = clamp(translate[1] + dy, mapBounds.minY, mapBounds.maxY);

    // Actualizar la proyección con la nueva traslación
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

// Agregar funcionalidad de zoom con la rueda del ratón
svg.on("wheel", (event) => {
  event.preventDefault();

  const zoomStep = 20; // Incremento o decremento de la escala por paso
  if (event.deltaY < 0 && scale < maxScale) {
    scale += zoomStep;
  } else if (event.deltaY > 0 && scale > minScale) {
    scale -= zoomStep;
  }

  projection.scale(scale);
  renderMap();
});

// Renderizado inicial del mapa
renderMap();

// Obtener y mostrar las ubicaciones desde el archivo externo
fetchLocations(ipList, (fetchedLocations) => {
  locations = fetchedLocations; // Actualizar las ubicaciones globales
  renderLocations(); // Renderizar los puntos
});
