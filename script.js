//Escalado del mapa
let scale = 150; // Escalado medio
const minScale = 100; //Zoom minimo
const maxScale = 300; // zoom maximo

// Select SVG and define dimensions
const svg = d3.select("#map");
const width = parseInt(svg.style("width"));
const height = parseInt(svg.style("height"));

// Projection and path
const projection = d3.geoMercator().scale(scale).translate([width / 2, height / 2]);
let path = d3.geoPath().projection(projection);

// Render map
function renderMap() {
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {
    svg.selectAll("path").remove(); // Clear existing paths
    svg.selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "land")
      .attr("fill", "black");
  });
}

// Initial render
renderMap();

// Handle zoom buttons
document.getElementById("zoom-in").addEventListener("click", () => {
  if (scale < maxScale) {
    scale += 20; // Increase scale
    projection.scale(scale);
    renderMap();
  }
});

document.getElementById("zoom-out").addEventListener("click", () => {
  if (scale > minScale) {
    scale -= 20; // Decrease scale
    projection.scale(scale);
    renderMap();
  }
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
