document.addEventListener("DOMContentLoaded", () => {
    const tablaCategorias = document.querySelector("#tabla-categorias tbody");
    const buscarCategoriaBtn = document.querySelector("#buscar-categoria-btn");
    const buscarIdInput = document.querySelector("#buscar-id");
    const actualizarCategoriaBtn = document.querySelector("#actualizar-categoria-btn");
    const crearCategoriaBtn = document.querySelector("#crear-categoria-btn");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    let categorias = []; // Almacena todas las categorías obtenidas
    let currentPage = 1;
    const itemsPerPage = 500;

    async function obtenerCategorias() {
        try {
            const response = await fetch('https://brc.onrender.com/api/categoria/obtenercategorias');
            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            
            categorias = await response.json();
            renderPage(currentPage); // Mostrar la primera página
        } catch (error) {
            console.error("Error al obtener categorías:", error);
            tablaCategorias.innerHTML = `<tr><td colspan="3">Error al cargar categorías: ${error.message}</td></tr>`;
        }
    }

    function renderPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = categorias.slice(start, end);

        mostrarCategorias(pageItems);
        pageInfo.textContent = `Página ${page}`;
        prevPageBtn.disabled = page === 1;
        nextPageBtn.disabled = end >= categorias.length;
    }

    function mostrarCategorias(pageItems) {
        if (!pageItems || pageItems.length === 0) {
            tablaCategorias.innerHTML = '<tr><td colspan="3">No hay categorías para mostrar.</td></tr>';
            return;
        }

        const categoriasHTML = pageItems.map(categoria => `
            <tr>
                <td>${categoria.id_categoria}</td>
                <td>${categoria.nombre}</td>
                <td><button class="eliminar-btn" data-id="${categoria.id_categoria}">Eliminar</button></td>
            </tr>
        `).join("");

        tablaCategorias.innerHTML = categoriasHTML;

        document.querySelectorAll(".eliminar-btn").forEach(btn => {
            btn.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                eliminarCategoria(id);
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
        if (currentPage * itemsPerPage < categorias.length) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    buscarCategoriaBtn.addEventListener("click", () => {
        const id = buscarIdInput.value;
        if (id) obtenerCategoriaPorId(id);
    });

    async function eliminarCategoria(id) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/categoria/elimcategorias/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`Error al eliminar la categoría: ${response.status}`);
            
            obtenerCategorias(); 
        } catch (error) {
            console.error("Error al eliminar categoría:", error);
        }
    }

    async function obtenerCategoriaPorId(id) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/categoria/categorias/${id}`);
            if (!response.ok) throw new Error(`Categoría no encontrada: ${response.status}`);
            
            const categoria = await response.json();
            mostrarCategorias([categoria]);
        } catch (error) {
            console.error("Error al obtener categoría:", error);
            tablaCategorias.innerHTML = `<tr><td colspan="3">Error al cargar categoría: ${error.message}</td></tr>`;
        }
    }

    async function actualizarCategoria(id, data) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/categoria/actcategorias/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`Error al actualizar la categoría: ${response.status}`);
            
            obtenerCategorias(); 
        } catch (error) {
            console.error("Error al actualizar categoría:", error);
        }
    }

    actualizarCategoriaBtn.addEventListener("click", () => {
        const id = document.getElementById('id-categoria-update').value;
        const nombre = document.getElementById('nombre-update').value;

        if (id && nombre) {
            const data = { nombre };
            actualizarCategoria(id, data);
        }
    });

    async function crearCategoria() {
        const nombre = document.getElementById('nombre').value;

        const data = { nombre };

        try {
            const response = await fetch('https://brc.onrender.com/api/categoria/crearcategorias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            
            alert('Categoría creada exitosamente');
            obtenerCategorias();
        } catch (error) {
            console.error('Error al crear la categoría:', error);
        }
    }

    crearCategoriaBtn.addEventListener('click', crearCategoria);
    
    obtenerCategorias();
});
