// Dimensiones y escala inicial
let scale = 150; // Escala inicial del mapa
const minScale = 100; // Escala mínima permitida
const maxScale = 800; // Escala máxima permitida

let translate = [0, 0]; // Translación inicial del mapa
let isDragging = false; // Bandera para rastrear si el usuario está arrastrando
let startPoint = [0, 0]; // Posición inicial del ratón al hacer clic

// Seleccionar el elemento SVG y definir sus dimensiones
const svg = d3.select("#map"); // Selecciona el SVG con el id "map"
const mapContainer = document.getElementById("map-container"); // Contenedor del mapa
const width = parseInt(svg.style("width")); // Obtiene el ancho del SVG en píxeles
const height = parseInt(svg.style("height")); // Obtiene la altura del SVG en píxeles

// Crear un tooltip
const tooltip = d3.select("body").append("div").attr("class", "tooltip"); 
// Agrega un div al body con la clase "tooltip" para mostrar información flotante

// Proyección y trayectoria
const projection = d3.geoMercator() // Define una proyección Mercator para el mapa
  .scale(scale) // Ajusta la escala inicial de la proyección
  .translate([width / 2, height / 2]); // Centra la proyección en el SVG
let path = d3.geoPath().projection(projection); // Crea un generador de trayectorias basado en la proyección

// Función para renderizar el mapa
function renderMap() {
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {
    svg.selectAll("path").remove(); // Limpia cualquier trayectoria existente en el mapa
    svg.selectAll("circle").remove(); // Limpia cualquier círculo existente (como el marcador)

    svg.selectAll("path") // Selecciona todas las trayectorias
      .data(data.features) // Asocia los datos GeoJSON con los elementos
      .enter() // Crea nuevos elementos para cada dato
      .append("path") // Agrega un elemento <path> al SVG para cada país
      .attr("d", path) // Define la forma de cada país utilizando la proyección
      .attr("class", "land") // Asigna una clase CSS "land" a los caminos
      .attr("fill", "black"); // Rellena los caminos con color negro

    renderLocation(); // Llama a la función para agregar ubicaciones específicas
  });
}

// Función para renderizar una ubicación específica
function renderLocation() {
  svg.selectAll(".location-point").remove();

  const location = {
    coordinates: [-3.7038, 40.4168], // Coordenadas de Madrid, España
    country: "España",
    province: "Comunidad de Madrid",
    locality: "Madrid"
  };

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
          <strong>País:</strong> ${location.country}<br>
          <strong>Provincia:</strong> ${location.province}<br>
          <strong>Localidad:</strong> ${location.locality}
        `);
    })
    .on("mouseout", () => {
      tooltip.style("display", "none");
    });
}

// Renderizado inicial del mapa
renderMap();

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

// Agregar funcionalidad de "drag and pan" con cambio de cursor
svg.on("mousedown", (event) => {
  isDragging = true;
  startPoint = [event.clientX, event.clientY];
  mapContainer.classList.add("grabbing"); // Cambia el cursor a mano cerrada
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
  mapContainer.classList.remove("grabbing"); // Regresa el cursor a mano abierta
});

svg.on("mouseleave", () => {
  isDragging = false;
  mapContainer.classList.remove("grabbing"); // Asegura que el cursor vuelva a mano abierta
});
// Función para limitar los valores de traslación
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Modificar el evento de arrastre
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

    // Actualizar el punto inicial para el próximo movimiento
    startPoint = [event.clientX, event.clientY];
  }
});