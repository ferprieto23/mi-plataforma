document.addEventListener('DOMContentLoaded', function () {
    // Mostrar formularios dependiendo de la acción seleccionada
    const intervenirBtn = document.getElementById('intervenirBtn');
    const reportarBtn = document.getElementById('reportarBtn');
    const materialesBtn = document.getElementById('materialesBtn');

    const intervenirForm = document.getElementById('intervenirForm');
    const reportarForm = document.getElementById('reportarForm');
    const materialesForm = document.getElementById('materialesForm');

    intervenirBtn.addEventListener('click', function () {
        intervenirForm.classList.remove('hidden');
        reportarForm.classList.add('hidden');
        materialesForm.classList.add('hidden');
    });

    reportarBtn.addEventListener('click', function () {
        reportarForm.classList.remove('hidden');
        intervenirForm.classList.add('hidden');
        materialesForm.classList.add('hidden');
    });

    materialesBtn.addEventListener('click', function () {
        materialesForm.classList.remove('hidden');
        intervenirForm.classList.add('hidden');
        reportarForm.classList.add('hidden');
    });

    // Mostrar opciones específicas según tipo de trabajo
    const tipoTrabajo = document.getElementById('tipoTrabajo');
    const preventivoOptions = document.getElementById('preventivoOptions');
    const desmonteOptions = document.getElementById('desmonteOptions');

    tipoTrabajo.addEventListener('change', function () {
        if (this.value === 'preventivo') {
            preventivoOptions.classList.remove('hidden');
            desmonteOptions.classList.add('hidden');
        } else if (this.value === 'desmonte') {
            desmonteOptions.classList.remove('hidden');
            preventivoOptions.classList.add('hidden');
        }
    });

    // Función para enviar los datos del formulario Intervención
    document.getElementById('enviarIntervencion').addEventListener('click', function () {
        const tipo = document.getElementById('tipoTrabajo').value;
        const direccion = document.getElementById('direccion').value;
        const imagenes = document.getElementById('imagenes').files;

        const formData = new FormData();
        formData.append('tipoTrabajo', tipo);
        formData.append('direccion', direccion);
        for (let i = 0; i < imagenes.length; i++) {
            formData.append('imagenes[]', imagenes[i]);
        }

        fetch('/enviarIntervencion', {
            method: 'POST',
            body: formData
        }).then(response => {
            alert('Intervención enviada');
        }).catch(error => {
            console.error('Error:', error);
        });
    });

    // Función para enviar los datos del formulario Reporte
    document.getElementById('enviarReporte').addEventListener('click', function () {
        const tipoReporte = document.getElementById('tipoReporte').value;
        const comentarios = document.getElementById('comentariosReporte').value;
        const imagenesReporte = document.getElementById('imagenesReporte').files;

        const formData = new FormData();
        formData.append('tipoReporte', tipoReporte);
        formData.append('comentarios', comentarios);
        for (let i = 0; i < imagenesReporte.length; i++) {
            formData.append('imagenes[]', imagenesReporte[i]);
        }

        fetch('/enviarReporte', {
            method: 'POST',
            body: formData
        }).then(response => {
            alert('Reporte enviado');
        }).catch(error => {
            console.error('Error:', error);
        });
    });

    // Función para enviar los datos del formulario Materiales
    document.getElementById('enviarMateriales').addEventListener('click', function () {
        const tipoMaterial = document.getElementById('materialTipo').value;

        fetch('/enviarMateriales', {
            method: 'POST',
            body: JSON.stringify({ tipoMaterial }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            alert('Pedido de materiales enviado');
        }).catch(error => {
            console.error('Error:', error);
        });
    });
});
