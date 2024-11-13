document.addEventListener("DOMContentLoaded", () => {
    const tablaPasteles = document.querySelector("#tabla-pasteles tbody");
    const buscarPastelBtn = document.querySelector("#buscar-pastel-btn");
    const buscarIdInput = document.querySelector("#buscar-id");
    const crearPastelBtn = document.querySelector("#crear-pastel-btn");
    const siguientePaginaBtn = document.querySelector("#siguiente-pagina-btn");
    const paginaAnteriorBtn = document.querySelector("#pagina-anterior-btn");
    const numeroPagina = document.querySelector("#numero-pagina");

    let paginaActual = 1;
    const elementosPorPagina = 500;

    async function obtenerPasteles() {
        try {
            const response = await fetch(`https://brc.onrender.com/api/pastel/obtenerpasteles?page=${paginaActual}&limit=${elementosPorPagina}`);
            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            
            const { pasteles, totalPaginas } = await response.json();
            mostrarPasteles(pasteles);

            siguientePaginaBtn.disabled = paginaActual >= totalPaginas;
            paginaAnteriorBtn.disabled = paginaActual <= 1;
            numeroPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
        } catch (error) {
            console.error("Error al obtener pasteles:", error);
            tablaPasteles.innerHTML = `<tr><td colspan="7">Error al cargar pasteles: ${error.message}</td></tr>`;
        }
    }

    function mostrarPasteles(pasteles) {
        if (!pasteles || pasteles.length === 0) {
            tablaPasteles.innerHTML = '<tr><td colspan="7">No hay pasteles para mostrar.</td></tr>';
            return;
        }

        const pastelesHTML = pasteles.map(pastel => `
            <tr>
                <td>${pastel.id_pastel}</td>
                <td>${pastel.nombre}</td>
                <td>${pastel.descripcion}</td>
                <td>${pastel.precio}</td>
                <td>${pastel.popularidad}</td>
                <td>${pastel.destacado ? 'Sí' : 'No'}</td>
                <td><button class="eliminar-btn" data-id="${pastel.id_pastel}">Eliminar</button></td>
            </tr>
        `).join("");

        tablaPasteles.innerHTML = pastelesHTML;

        document.querySelectorAll(".eliminar-btn").forEach(btn => {
            btn.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                eliminarPastel(id);
            });
        });
    }

    async function eliminarPastel(id) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/pastel/elimpasteles/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`Error al eliminar el pastel: ${response.status}`);
            
            obtenerPasteles();
        } catch (error) {
            console.error("Error al eliminar pastel:", error);
        }
    }

    async function obtenerPastelPorId(id) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/pastel/pasteles/${id}`);
            if (!response.ok) throw new Error(`Pastel no encontrado: ${response.status}`);
            
            const pastel = await response.json();
            mostrarPasteles([pastel]);
        } catch (error) {
            console.error("Error al obtener pastel:", error);
            tablaPasteles.innerHTML = `<tr><td colspan="7">Error al cargar pastel: ${error.message}</td></tr>`;
        }
    }

    buscarPastelBtn.addEventListener("click", () => {
        const id = buscarIdInput.value;
        if (id) obtenerPastelPorId(id);
    });

    async function crearPastel() {
        const nombre = document.getElementById('nombre').value;
        const descripcion = document.getElementById('descripcion').value;
        const precio = document.getElementById('precio').value;
        const popularidad = document.getElementById('popularidad').value || 0;
        const destacado = document.getElementById('destacado').checked;

        const data = { nombre, descripcion, precio, popularidad, destacado };

        try {
            const response = await fetch('https://brc.onrender.com/api/pastel/crearpasteles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            
            alert('Pastel creado exitosamente');
            obtenerPasteles();
        } catch (error) {
            console.error('Error al crear el pastel:', error);
        }
    }

    crearPastelBtn.addEventListener('click', crearPastel);

    siguientePaginaBtn.addEventListener("click", () => {
        paginaActual++;
        obtenerPasteles();
    });

    paginaAnteriorBtn.addEventListener("click", () => {
        paginaActual--;
        obtenerPasteles();
    });

    obtenerPasteles();
});
