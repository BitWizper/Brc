document.addEventListener("DOMContentLoaded", () => {
    const tablaUsuarios = document.querySelector("#tabla-usuarios tbody");
    const buscarUsuarioBtn = document.querySelector("#buscar-usuario-btn");
    const buscarIdInput = document.querySelector("#buscar-id");
    const crearUsuarioBtn = document.querySelector("#crear-usuario-btn");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    let usuarios = [];
    let currentPage = 1;
    const itemsPerPage = 10;

    // Función para obtener usuarios del backend
    async function obtenerUsuarios() {
        try {
            const response = await fetch('https://brc.onrender.com/api/usuario/obtenerusuarios');
            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            usuarios = await response.json();
            renderPage(currentPage); // Mostrar la primera página
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            tablaUsuarios.innerHTML = `<tr><td colspan="7">Error al cargar usuarios: ${error.message}</td></tr>`;
        }
    }

    function renderPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = usuarios.slice(start, end);

        mostrarUsuarios(pageItems);
        pageInfo.textContent = `Página ${page}`;
        prevPageBtn.disabled = page === 1;
        nextPageBtn.disabled = end >= usuarios.length;
    }

    // Función para mostrar los usuarios en la tabla
    function mostrarUsuarios(pageItems) {
        if (!pageItems || pageItems.length === 0) {
            tablaUsuarios.innerHTML = '<tr><td colspan="7">No hay usuarios para mostrar.</td></tr>';
            return;
        }

        tablaUsuarios.innerHTML = pageItems.map(usuario => {
            return `
                <tr>
                    <td>${usuario.id_usuario || "ID no disponible"}</td>
                    <td>${usuario.nombre || "Nombre no disponible"}</td>
                    <td>${usuario.correo || "Correo no disponible"}</td>
                    <td>${usuario.direccion || "Dirección no disponible"}</td>
                    <td>${usuario.telefono || "Teléfono no disponible"}</td>
                    <td>${usuario.tipo_usuario || "Tipo no disponible"}</td>
                    <td><button class="eliminar-btn" data-id="${usuario.id_usuario || ''}">Eliminar</button></td>
                </tr>
            `;
        }).join("");

        // Añadir eventos a los botones de eliminar
        document.querySelectorAll(".eliminar-btn").forEach(btn => {
            btn.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                eliminarUsuario(id);
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
        if (currentPage * itemsPerPage < usuarios.length) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    // Función para eliminar un usuario
    async function eliminarUsuario(id) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/usuario/elimusuarios/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`Error al eliminar el usuario: ${response.status}`);
            obtenerUsuarios();
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    }

    // Función para obtener usuario por ID
    async function obtenerUsuarioPorId(id) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/usuario/usuarios/${id}`);
            if (!response.ok) throw new Error(`Usuario no encontrado: ${response.status}`);
            const usuario = await response.json();
            mostrarUsuarios([usuario]);
        } catch (error) {
            console.error("Error al obtener usuario:", error);
            tablaUsuarios.innerHTML = `<tr><td colspan="7">Error al cargar usuario: ${error.message}</td></tr>`;
        }
    }

    // Evento de búsqueda por ID
    buscarUsuarioBtn.addEventListener("click", () => {
        const id = buscarIdInput.value;
        if (id) obtenerUsuarioPorId(id);
    });

    // Función para crear un nuevo usuario
    async function crearUsuario() {
        const nombre = document.getElementById('nombre').value;
        const correo = document.getElementById('correo').value;
        const contrasena = document.getElementById('contrasena').value;
        const direccion = document.getElementById('direccion').value;
        const telefono = document.getElementById('telefono').value;
        const tipoUsuario = document.getElementById('tipo-usuario').value;

        const data = { nombre, correo, contrasena, direccion, telefono, tipo_usuario: tipoUsuario };

        try {
            const response = await fetch('https://brc.onrender.com/api/usuario/crearusuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            alert('Usuario creado exitosamente');
            obtenerUsuarios();
        } catch (error) {
            console.error('Error al crear el usuario:', error);
        }
    }

    // Evento de creación de usuario
    crearUsuarioBtn.addEventListener('click', crearUsuario);

    // Llama a la función original para obtener todos los usuarios al cargar la página
    obtenerUsuarios();
});

