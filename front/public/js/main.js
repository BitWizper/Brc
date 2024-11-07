function mostrarVista(vista) {
  document.getElementById('titulo-seccion').innerText = vista.charAt(0).toUpperCase() + vista.slice(1);
  
  let contenido = document.getElementById('contenido');
  contenido.innerHTML = `<p>Cargando ${vista}...</p>`;

  fetch(`/obtener${vista}`)
      .then(response => response.json())
      .then(data => {
          contenido.innerHTML = generarTabla(data);
      })
      .catch(error => {
          contenido.innerHTML = `<p>Error al cargar ${vista}: ${error.message}</p>`;
      });
}

function generarTabla(data) {
  let table = `<table><thead><tr>`;
  const headers = Object.keys(data[0]);
  headers.forEach(header => table += `<th>${header}</th>`);
  table += `</tr></thead><tbody>`;
  data.forEach(item => {
      table += `<tr>`;
      headers.forEach(header => table += `<td>${item[header]}</td>`);
      table += `</tr>`;
  });
  table += `</tbody></table>`;
  return table;
}
