// Función para mostrar opciones según el tipo de trabajo
function showOptions(type) {
    const subOptions = document.getElementById("subOptions");
    const imageUpload = document.getElementById("imageUpload");
    const gpsLocation = document.getElementById("gpsLocation");
    const submitBtn = document.getElementById("submitBtn");

    subOptions.innerHTML = '';  // Limpiar opciones anteriores
    imageUpload.classList.add("hidden");
    gpsLocation.classList.add("hidden");
    submitBtn.classList.add("hidden");

    if (type === "preventivo") {
        subOptions.innerHTML = `
            <label for="preventivoOptions">Seleccione subtipo:</label>
            <select id="preventivoOptions" name="subType">
                <option value="CTO">Cierre de CTO</option>
                <option value="Reacondicionamiento">Reacondicionamiento</option>
                <option value="Balona">Balona</option>
            </select>
        `;
    } else if (type === "desmonte") {
        subOptions.innerHTML = `
            <label for="desmonteOptions">Seleccione subtipo:</label>
            <select id="desmonteOptions" name="subType">
                <option value="Cobre">Caja de cobre</option>
                <option value="Cable">Cable</option>
            </select>
        `;
    } else if (type === "materiales") {
        subOptions.innerHTML = `
            <label for="materialesOptions">Seleccione material:</label>
            <select id="materialesOptions" name="subType">
                <option value="Fibra">Fibra óptica</option>
                <option value="Herramientas">Herramientas</option>
            </select>
        `;
    }

    subOptions.classList.remove("hidden");
    imageUpload.classList.remove("hidden");
    gpsLocation.classList.remove("hidden");
    submitBtn.classList.remove("hidden");
}

// Función para obtener ubicación GPS
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById("latitude").value = "No soportada";
        document.getElementById("longitude").value = "No soportada";
    }
}

function showPosition(position) {
    document.getElementById("latitude").value = position.coords.latitude;
    document.getElementById("longitude").value = position.coords.longitude;
}
