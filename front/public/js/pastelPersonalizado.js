document.addEventListener("DOMContentLoaded", () => {
    const tablaPastelesPersonalizados = document.querySelector("#tabla-pastelesPersonalizados tbody");
    const buscarPastelPersonalizadoBtn = document.querySelector("#buscar-pastelPersonalizado-btn");
    const buscarIdInput = document.querySelector("#buscar-id");
    const crearPastelPersonalizadoBtn = document.querySelector("#crear-pastelPersonalizado-btn");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    let pastelesPersonalizados = []; // Almacena todos los pasteles personalizados obtenidos
    let currentPage = 1;
    const itemsPerPage = 500;

    async function obtenerPastelesPersonalizados() {
        try {
            const response = await fetch('https://brc.onrender.com/api/PastelPersonalizado/obtenerpastelPersonalizado');
            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            
            pastelesPersonalizados = await response.json();
            renderPage(currentPage); // Mostrar la primera página
        } catch (error) {
            console.error("Error al obtener pasteles personalizados:", error);
            tablaPastelesPersonalizados.innerHTML = `<tr><td colspan="7">Error al cargar pasteles personalizados: ${error.message}</td></tr>`;
        }
    }

    function renderPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = pastelesPersonalizados.slice(start, end);

        mostrarPastelesPersonalizados(pageItems);
        pageInfo.textContent = `Página ${page}`;
        prevPageBtn.disabled = page === 1;
        nextPageBtn.disabled = end >= pastelesPersonalizados.length;
    }

    function mostrarPastelesPersonalizados(pageItems) {
        if (!pageItems || pageItems.length === 0) {
            tablaPastelesPersonalizados.innerHTML = '<tr><td colspan="7">No hay pasteles personalizados para mostrar.</td></tr>';
            return;
        }

        const pastelesHTML = pageItems.map(pastel => `
            <tr>
                <td>${pastel.id_pastelPersonalizado}</td>
                <td>${pastel.Bizcocho}</td>
                <td>${pastel.Relleno}</td>
                <td>${pastel.Decoraciones}</td>
                <td>${pastel.Precio}</td>
                <td>${new Date(pastel.FechaDiseño).toLocaleDateString()}</td>
                <td><button class="eliminar-btn" data-id="${pastel.id_pastelPersonalizado}">Eliminar</button></td>
            </tr>
        `).join("");

        tablaPastelesPersonalizados.innerHTML = pastelesHTML;

        document.querySelectorAll(".eliminar-btn").forEach(btn => {
            btn.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                eliminarPastelPersonalizado(id);
            });
        });
    }

    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if (currentPage * itemsPerPage < pastelesPersonalizados.length) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    buscarPastelPersonalizadoBtn.addEventListener("click", () => {
        const id = buscarIdInput.value;
        if (id) obtenerPastelPersonalizadoPorId(id);
    });

    async function eliminarPastelPersonalizado(id) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/PastelPersonalizado/elimpastelPersonalizado/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`Error al eliminar el pastel personalizado: ${response.status}`);
            
            obtenerPastelesPersonalizados();
        } catch (error) {
            console.error("Error al eliminar pastel personalizado:", error);
        }
    }

    async function obtenerPastelPersonalizadoPorId(id) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/PastelPersonalizado/pastelPersonalizado/${id}`);
            if (!response.ok) throw new Error(`Pastel personalizado no encontrado: ${response.status}`);
            
            const pastel = await response.json();
            mostrarPastelesPersonalizados([pastel]);
        } catch (error) {
            console.error("Error al obtener pastel personalizado:", error);
            tablaPastelesPersonalizados.innerHTML = `<tr><td colspan="7">Error al cargar pastel personalizado: ${error.message}</td></tr>`;
        }
    }

    async function crearPastelPersonalizado() {
        const bizcocho = document.getElementById('bizcocho').value;
        const relleno = document.getElementById('relleno').value;
        const decoraciones = document.getElementById('decoraciones').value;
        const precio = document.getElementById('precio').value;

        const data = { Bizcocho: bizcocho, Relleno: relleno, Decoraciones: decoraciones, Precio: precio };

        try {
            const response = await fetch('https://brc.onrender.com/api/PastelPersonalizado/crearpastelPersonalizado', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            
            alert('Pastel personalizado creado exitosamente');
            obtenerPastelesPersonalizados();
        } catch (error) {
            console.error('Error al crear el pastel personalizado:', error);
        }
    }

    crearPastelPersonalizadoBtn.addEventListener('click', crearPastelPersonalizado);
    
    obtenerPastelesPersonalizados();
});
