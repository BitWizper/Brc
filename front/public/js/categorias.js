document.addEventListener("DOMContentLoaded", () => {
    const tablaCategorias = document.querySelector("#tabla-categorias tbody");
    const buscarCategoriaBtn = document.querySelector("#buscar-categoria-btn");
    const buscarIdInput = document.querySelector("#buscar-id");
    const actualizarCategoriaBtn = document.querySelector("#actualizar-categoria-btn");
    const crearCategoriaBtn = document.querySelector("#crear-categoria-btn");

    async function obtenerCategorias() {
        try {
            const response = await fetch('http://localhost:3000/api/categoria/obtenercategorias');
            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            
            const categorias = await response.json();
            mostrarCategorias(categorias);
        } catch (error) {
            console.error("Error al obtener categorías:", error);
            tablaCategorias.innerHTML = `<tr><td colspan="3">Error al cargar categorías: ${error.message}</td></tr>`;
        }
    }

    function mostrarCategorias(categorias) {
        if (!categorias || categorias.length === 0) {
            tablaCategorias.innerHTML = '<tr><td colspan="3">No hay categorías para mostrar.</td></tr>';
            return;
        }

        const categoriasHTML = categorias.map(categoria => `
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

    async function eliminarCategoria(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/categoria/elimcategorias/${id}`, {
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
            const response = await fetch(`http://localhost:3000/api/categoria/categorias/${id}`);
            if (!response.ok) throw new Error(`Categoría no encontrada: ${response.status}`);
            
            const categoria = await response.json();
            mostrarCategorias([categoria]);
        } catch (error) {
            console.error("Error al obtener categoría:", error);
            tablaCategorias.innerHTML = `<tr><td colspan="3">Error al cargar categoría: ${error.message}</td></tr>`;
        }
    }

    buscarCategoriaBtn.addEventListener("click", () => {
        const id = buscarIdInput.value;
        if (id) obtenerCategoriaPorId(id);
    });

    async function actualizarCategoria(id, data) {
        try {
            const response = await fetch(`http://localhost:3000/api/categoria/actcategorias/${id}`, {
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
            const response = await fetch('http://localhost:3000/api/categoria/crearcategorias', {
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
