document.addEventListener("DOMContentLoaded", () => {
    const tablaReposteros = document.querySelector("#tabla-reposteros tbody");
    const buscarReposteroBtn = document.querySelector("#buscar-repostero-btn");
    const buscarIdInput = document.querySelector("#buscar-id");
    const actualizarReposteroBtn = document.querySelector("#actualizar-repostero-btn");
    const idReposteroUpdateInput = document.querySelector("#id-repostero-update");
    const nombreUpdateInput = document.querySelector("#nombre-update");
    const especialidadUpdateInput = document.querySelector("#especialidad-update");
    const crearReposteroBtn = document.querySelector("#crear-repostero-btn");
  
    async function obtenerReposteros() {
      try {
        const response = await fetch('http://localhost:3000/api/repostero/obtenereposteros');
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
        
        const reposteros = await response.json();
        mostrarReposteros(reposteros);
      } catch (error) {
        console.error("Error al obtener reposteros:", error);
        tablaReposteros.innerHTML = `<tr><td colspan="6">Error al cargar reposteros: ${error.message}</td></tr>`;
      }
    }
  
    function mostrarReposteros(reposteros) {
      if (!reposteros || reposteros.length === 0) {
        tablaReposteros.innerHTML = '<tr><td colspan="6">No hay reposteros para mostrar.</td></tr>';
        return;
      }
  
      const reposterosHTML = reposteros.map(repostero => `
        <tr>
          <td>${repostero.id_repostero}</td>
          <td>${repostero.NombreNegocio}</td>
          <td>${repostero.Ubicacion}</td>
          <td>${repostero.Especialidades}</td>
          <td><a href="${repostero.PortafolioURL}" target="_blank">Ver Portafolio</a></td>
          <td><button class="eliminar-btn" data-id="${repostero.id_repostero}">Eliminar</button></td>
        </tr>
      `).join("");
  
      tablaReposteros.innerHTML = reposterosHTML;
  
      document.querySelectorAll(".eliminar-btn").forEach(btn => {
        btn.addEventListener("click", (event) => {
          const id = event.target.getAttribute("data-id");
          eliminarRepostero(id);
        });
      });
    }
  
    async function eliminarRepostero(id) {
      try {
        const response = await fetch(`http://localhost:3000/api/repostero/elimreposteros/${id}`, {
          method: 'DELETE'
        });
    
        if (!response.ok) throw new Error(`Error al eliminar el repostero: ${response.status}`);
        
        obtenerReposteros(); 
      } catch (error) {
        console.error("Error al eliminar repostero:", error);
      }
    }
  
    async function obtenerReposteroPorId(id) {
      try {
        const response = await fetch(`http://localhost:3000/api/repostero/reposteros/${id}`);
        if (!response.ok) throw new Error(`Repostero no encontrado: ${response.status}`);
        
        const repostero = await response.json();
        mostrarReposteros([repostero]);
      } catch (error) {
        console.error("Error al obtener repostero:", error);
        tablaReposteros.innerHTML = `<tr><td colspan="6">Error al cargar repostero: ${error.message}</td></tr>`;
      }
    }
  
    buscarReposteroBtn.addEventListener("click", () => {
      const id = buscarIdInput.value;
      if (id) obtenerReposteroPorId(id);
    });
  
    async function actualizarRepostero(id, data) {
      try {
        const response = await fetch(`http://localhost:3000/api/repostero/actreposteros/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
    
        if (!response.ok) throw new Error(`Error al actualizar el repostero: ${response.status}`);
        
        obtenerReposteros(); 
      } catch (error) {
        console.error("Error al actualizar repostero:", error);
      }
    }
  
    actualizarReposteroBtn.addEventListener("click", () => {
      const id = idReposteroUpdateInput.value;
      const nombre = nombreUpdateInput.value;
      const especialidad = especialidadUpdateInput.value;
  
      if (id && nombre && especialidad) {
        const data = { NombreNegocio: nombre, Especialidades: especialidad };
        actualizarRepostero(id, data);
      }
    });
  
    async function crearRepostero() {
      const nombre = document.getElementById('nombre').value;
      const especialidad = document.getElementById('especialidad').value;
      const ubicacion = document.getElementById('ubicacion').value;
      const portafolioURL = document.getElementById('portafolio-url').value;
  
      const data = {
        NombreNegocio: nombre,
        Ubicacion: ubicacion,
        Especialidades: especialidad,
        PortafolioURL: portafolioURL
      };
  
      try {
        const response = await fetch('http://localhost:3000/api/repostero/creareposteros', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
    
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
        
        alert('Repostero creado exitosamente');
        obtenerReposteros();
      } catch (error) {
        console.error('Error al crear el repostero:', error);
      }
    }
  
    crearReposteroBtn.addEventListener('click', crearRepostero);
    
    obtenerReposteros();
  });
  