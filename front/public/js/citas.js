document.addEventListener("DOMContentLoaded", () => {
    const tablaCitas = document.querySelector("#tabla-citas tbody");
    const buscarCitaBtn = document.querySelector("#buscar-cita-btn");
    const buscarIdInput = document.querySelector("#buscar-id");
    const crearCitaBtn = document.querySelector("#crear-cita-btn");

    async function obtenerCitas() {
        try {
            const response = await fetch('http://localhost:3000/api/cita/obtenercitas');
            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);

            const citas = await response.json();
            mostrarCitas(citas);
        } catch (error) {
            console.error("Error al obtener citas:", error);
            tablaCitas.innerHTML = `<tr><td colspan="6">Error al cargar citas: ${error.message}</td></tr>`;
        }
    }

    function mostrarCitas(citas) {
        if (!citas || citas.length === 0) {
            tablaCitas.innerHTML = '<tr><td colspan="6">No hay citas para mostrar.</td></tr>';
            return;
        }

        const citasHTML = citas.map(cita => `
            <tr>
                <td>${cita.id_cita}</td>
                <td>${cita.id_usuario}</td>
                <td>${cita.id_repostero}</td>
                <td>${new Date(cita.fecha_cita).toLocaleString()}</td>
                <td>${cita.estado}</td>
                <td><button class="eliminar-btn" data-id="${cita.id_cita}">Eliminar</button></td>
            </tr>
        `).join("");

        tablaCitas.innerHTML = citasHTML;

        document.querySelectorAll(".eliminar-btn").forEach(btn => {
            btn.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                eliminarCita(id);
            });
        });
    }

    async function eliminarCita(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/cita/elimcitas/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`Error al eliminar la cita: ${response.status}`);

            obtenerCitas();
        } catch (error) {
            console.error("Error al eliminar cita:", error);
        }
    }

    async function obtenerCitaPorId(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/cita/citas/${id}`);
            if (!response.ok) throw new Error(`Cita no encontrada: ${response.status}`);

            const cita = await response.json();
            mostrarCitas([cita]);
        } catch (error) {
            console.error("Error al obtener cita:", error);
            tablaCitas.innerHTML = `<tr><td colspan="6">Error al cargar cita: ${error.message}</td></tr>`;
        }
    }

    buscarCitaBtn.addEventListener("click", () => {
        const id = buscarIdInput.value;
        if (id) obtenerCitaPorId(id);
    });

    async function crearCita() {
        const id_usuario = document.getElementById('id-usuario').value;
        const id_repostero = document.getElementById('id-repostero').value;
        const fecha_cita = document.getElementById('fecha-cita').value;

        const data = {
            id_usuario,
            id_repostero,
            fecha_cita
        };

        try {
            const response = await fetch('http://localhost:3000/api/cita/crearcitas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);

            alert('Cita creada exitosamente');
            obtenerCitas();
        } catch (error) {
            console.error('Error al crear la cita:', error);
        }
    }

    crearCitaBtn.addEventListener('click', crearCita);

    obtenerCitas();
});
