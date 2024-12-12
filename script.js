// Dimensiones y escala inicial
let scale = 150; // Escala inicial del mapa
const minScale = 100; // Escala mínima permitida
const maxScale = 800; // Escala máxima permitida

let translate = [0, 0]; // Translación inicial del mapa
let isDragging = false; // Bandera para rastrear si el usuario está arrastrando
let startPoint = [0, 0]; // Posición inicial del ratón al hacer clic

// Seleccionar el elemento SVG y definir sus dimensiones
const svg = d3.select("#map"); // Selecciona el SVG con el id "map"
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
  // Limpia cualquier marcador previo antes de renderizar uno nuevo
  svg.selectAll(".location-point").remove();

  // Define una ubicación con sus detalles
  const location = {
    coordinates: [-3.7038, 40.4168], // Coordenadas de longitud y latitud (Ejemplo: Madrid, España)
    country: "España", // País
    province: "Comunidad de Madrid", // Provincia
    locality: "Madrid" // Localidad
  };

  // Agrega un punto de ubicación en el mapa
  svg.append("circle") // Agrega un elemento <circle> al SVG
    .attr("class", "location-point") // Asigna una clase CSS "location-point"
    .attr("cx", () => projection(location.coordinates)[0]) // Calcula la posición X del punto proyectado
    .attr("cy", () => projection(location.coordinates)[1]) // Calcula la posición Y del punto proyectado
    .attr("r", 5) // Define el radio del círculo (tamaño del punto)
    .on("mouseover", (event) => {
      // Muestra un tooltip con información al pasar el ratón sobre el punto
      tooltip
        .style("display", "block") // Hace visible el tooltip
        .style("left", `${event.pageX + 10}px`) // Posiciona el tooltip a la derecha del ratón
        .style("top", `${event.pageY + 10}px`) // Posiciona el tooltip abajo del ratón
        .html(`
          <strong>País:</strong> ${location.country}<br>
          <strong>Provincia:</strong> ${location.province}<br>
          <strong>Localidad:</strong> ${location.locality}
        `); // Muestra los detalles de la ubicación en formato HTML
    })
    .on("mouseout", () => {
      // Oculta el tooltip al mover el ratón fuera del punto
      tooltip.style("display", "none");
    });
}

// Renderizado inicial del mapa
renderMap(); // Llama a la función para cargar el mapa y las ubicaciones

// Manejo de los botones de zoom
document.getElementById("zoom-in").addEventListener("click", () => {
  if (scale < maxScale) { // Verifica si la escala no supera el límite máximo
    scale += 20; // Aumenta la escala en 20 unidades
    projection.scale(scale); // Actualiza la proyección con la nueva escala
    renderMap(); // Vuelve a renderizar el mapa con la nueva escala
  }
});

document.getElementById("zoom-out").addEventListener("click", () => {
  if (scale > minScale) { // Verifica si la escala no cae por debajo del límite mínimo
    scale -= 20; // Reduce la escala en 20 unidades
    projection.scale(scale); // Actualiza la proyección con la nueva escala
    renderMap(); // Vuelve a renderizar el mapa con la nueva escala
  }
});

// Agregar funcionalidad de "drag and pan"
svg.on("mousedown", (event) => {
  isDragging = true; // Inicia el estado de arrastre
  startPoint = [event.clientX, event.clientY]; // Guarda el punto inicial del clic
});

svg.on("mousemove", (event) => {
  if (isDragging) {
    // Calcula el desplazamiento del ratón
    const dx = event.clientX - startPoint[0];
    const dy = event.clientY - startPoint[1];

    // Actualiza la translación del mapa
    translate[0] += dx;
    translate[1] += dy;

    // Actualiza la proyección con la nueva translación
    projection.translate([
      width / 2 + translate[0],
      height / 2 + translate[1],
    ]);

    // Renderiza nuevamente el mapa
    renderMap();

    // Actualiza el punto inicial para el próximo movimiento
    startPoint = [event.clientX, event.clientY];
  }
});

svg.on("mouseup", () => {
  isDragging = false; // Finaliza el estado de arrastre
});

svg.on("mouseleave", () => {
  isDragging = false; // Asegura que se detenga el arrastre si el ratón sale del SVG
});




// Cargar ubicaciones guardadas en Local Storage y mostrarlas en el mapa
/*function cargarMarcadoresGuardados() {
  const visitasGuardadas = JSON.parse(localStorage.getItem('visitas')) || [];
  visitasGuardadas.forEach(visita => {
    agregarMarcador(visita.lat, visita.lon, `
      <b>País:</b> ${visita.pais}<br>
      <b>Ciudad:</b> ${visita.ciudad}
    `);
  });
}

// Guardar una nueva visita en Local Storage
function guardarVisita(visita) {
  const visitas = JSON.parse(localStorage.getItem('visitas')) || [];
  visitas.push(visita);
  localStorage.setItem('visitas', JSON.stringify(visitas));
}

// Obtener la geolocalización del usuario actual y agregar un marcador
fetch('http://ip-api.com/json/')
  .then(response => response.json())
  .then(data => {
    const { lat, lon, city, country } = data;

    // Crear la información de la visita
    const nuevaVisita = {
      pais: country,
      ciudad: city,
      lat: lat,
      lon: lon
    };

    guardarVisita(nuevaVisita);

    // Agregar marcador al mapa
    agregarMarcador(lat, lon, `
      <b>País:</b> ${country}<br>
      <b>Ciudad:</b> ${city}
    `);

    
  })
  .catch(error => console.error('Error al obtener datos de geolocalización:', error));

cargarMarcadoresGuardados();*/
