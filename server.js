const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Configuración de multer para manejar archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para manejar el guardado en Excel
app.post('/guardarExcel', upload.array('imagenTrabajo', 3), (req, res) => {
    const { tipoTrabajo, subTipo, direccion, observaciones } = req.body;
    const imagenes = req.files.map(file => file.filename);

    if (!tipoTrabajo || !subTipo || !direccion) {
        return res.json({ success: false, message: 'Faltan datos.' });
    }

    // Crear o cargar el archivo Excel
    const filePath = path.join(__dirname, 'relevamientos.xlsx');
    let workbook;
    
    if (fs.existsSync(filePath)) {
        workbook = XLSX.readFile(filePath);
    } else {
        workbook = XLSX.utils.book_new();
    }

    // Obtener la primera hoja
    let worksheet = workbook.Sheets['Relevamientos'];
    if (!worksheet) {
        worksheet = XLSX.utils.aoa_to_sheet([
            ['ID', 'Tipo de Trabajo', 'Sub Tipo', 'Dirección', 'Observaciones', 'Imagenes']
        ]);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Relevamientos');
    }

    // Agregar nueva fila de datos
    const rowCount = worksheet['!rows'] ? worksheet['!rows'].length : 1;
    const newRow = [
        `Relevamiento ${rowCount + 1}`,
        tipoTrabajo,
        subTipo,
        direccion,
        observaciones,
        imagenes.join(', ')
    ];

    XLSX.utils.sheet_add_aoa(worksheet, [newRow], { origin: -1 });
    XLSX.writeFile(workbook, filePath);

    res.json({ success: true, relevamientoId: `Relevamiento ${rowCount + 1}`, imagenes });
});

// Ruta para manejar el envío por WhatsApp (solo muestra cómo recibir los datos, no envía realmente)
app.post('/enviarWhatsApp', upload.array('imagenTrabajo', 3), (req, res) => {
    const { tipoTrabajo, subTipo, latitud, longitud, direccion, observaciones } = req.body;
    const imagenes = req.files.map(file => file.filename);

    console.log({
        tipoTrabajo,
        subTipo,
        latitud,
        longitud,
        direccion,
        observaciones,
        imagenes
    });

    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
