document.addEventListener("DOMContentLoaded", () => {
    const tablaResenas = document.querySelector("#tabla-resenas tbody");
    const buscarResenaBtn = document.querySelector("#buscar-resena-btn");
    const buscarIdInput = document.querySelector("#buscar-id");
    const actualizarResenaBtn = document.querySelector("#actualizar-resena-btn");
    const idResenaUpdateInput = document.querySelector("#id-resena-update");
    const comentarioUpdateInput = document.querySelector("#comentario-update");
    const crearResenaBtn = document.querySelector("#crear-resena-btn");

    // Función para obtener reseñas del backend
    async function obtenerResenas() {
        try {
            const response = await fetch('http://localhost:3000/api/resena/obtenerresenas');
            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            const resenas = await response.json();
            console.log("Reseñas obtenidas del backend:", resenas);
            mostrarResenas(resenas);
        } catch (error) {
            console.error("Error al obtener reseñas:", error);
            tablaResenas.innerHTML = `<tr><td colspan="6">Error al cargar reseñas: ${error.message}</td></tr>`;
        }
    }

    // Función para mostrar las reseñas en la tabla
    function mostrarResenas(resenas) {
        if (!resenas || resenas.length === 0) {
            tablaResenas.innerHTML = '<tr><td colspan="6">No hay reseñas para mostrar.</td></tr>';
            return;
        }

        tablaResenas.innerHTML = resenas.map(resena => {
            return `
                <tr>
                    <td>${resena.id_resena || "ID no disponible"}</td>
                    <td>${resena.id_usuario || "Usuario no disponible"}</td>
                    <td>${resena.Comentario || "Comentario no disponible"}</td>
                    <td>${resena.Calificacion || "Calificación no disponible"}</td>
                    <td>${resena.FechaResena ? new Date(resena.FechaResena).toLocaleDateString() : "Fecha no disponible"}</td>
                    <td><button class="eliminar-btn" data-id="${resena.id_resena || ''}">Eliminar</button></td>
                </tr>
            `;
        }).join("");

        // Añadir eventos a los botones de eliminar
        document.querySelectorAll(".eliminar-btn").forEach(btn => {
            btn.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                eliminarResena(id);
            });
        });
    }

    // Función para eliminar una reseña
    async function eliminarResena(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/resena/elimresenas/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`Error al eliminar la reseña: ${response.status}`);
            obtenerResenas();
        } catch (error) {
            console.error("Error al eliminar reseña:", error);
        }
    }

    // Función para obtener reseña por ID
    async function obtenerResenaPorId(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/resena/resenas/${id}`);
            if (!response.ok) throw new Error(`Reseña no encontrada: ${response.status}`);
            const resena = await response.json();
            mostrarResenas([resena]);
        } catch (error) {
            console.error("Error al obtener reseña:", error);
            tablaResenas.innerHTML = `<tr><td colspan="6">Error al cargar reseña: ${error.message}</td></tr>`;
        }
    }

    // Evento de búsqueda por ID
    buscarResenaBtn.addEventListener("click", () => {
        const id = buscarIdInput.value;
        if (id) obtenerResenaPorId(id);
    });

    // Función para actualizar una reseña
    async function actualizarResena(id, data) {
        try {
            const response = await fetch(`http://localhost:3000/api/resena/actresenas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`Error al actualizar la reseña: ${response.status}`);
            obtenerResenas();
        } catch (error) {
            console.error("Error al actualizar reseña:", error);
        }
    }

    // Evento de actualización de reseña
    actualizarResenaBtn.addEventListener("click", () => {
        const id = idResenaUpdateInput.value;
        const comentario = comentarioUpdateInput.value;
        if (id && comentario) actualizarResena(id, { Comentario: comentario });
    });

    // Función para crear una nueva reseña
    async function crearResena() {
        const idUsuario = document.getElementById('id-usuario').value;
        const comentario = document.getElementById('comentario').value;
        const calificacion = document.getElementById('calificacion').value;
        const fechaResena = document.getElementById('fecha-resena').value;

        const data = { id_usuario: idUsuario, Comentario: comentario, Calificacion: calificacion, FechaResena: fechaResena };

        try {
            const response = await fetch('http://localhost:3000/api/resena/crearresenas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            alert('Reseña creada exitosamente');
            obtenerResenas();
        } catch (error) {
            console.error('Error al crear la reseña:', error);
        }
    }

    // Evento de creación de reseña
    crearResenaBtn.addEventListener('click', crearResena);

    // Llama a la función original para obtener todas las reseñas al cargar la página
    obtenerResenas();
});
