const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { Client, MessageMedia } = require('whatsapp-web.js');
const sessionFilePath = path.resolve(__dirname, 'session.json');
const client = new Client({ session: require(sessionFilePath) });

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

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Puedes cambiar esto según el proveedor de correo
    auth: {
        user: 'tu-email@gmail.com', // Tu correo electrónico
        pass: 'tu-contraseña' // Tu contraseña de correo electrónico
    }
});

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para manejar el envío de intervención
app.post('/enviarIntervencion', upload.array('imagenes', 3), (req, res) => {
    const { tipoTrabajo, direccion } = req.body;
    const imagenes = req.files.map(file => file.filename);

    if (!tipoTrabajo || !direccion) {
        return res.json({ success: false, message: 'Faltan datos.' });
    }

    // Enviar a WhatsApp
    imagenes.forEach(imagen => {
        const media = MessageMedia.fromFilePath(path.join(__dirname, 'uploads', imagen));
        client.sendMessage('+541136741002', media);
    });

    // Enviar correo electrónico
    const mailOptions = {
        from: 'tu-email@gmail.com',
        to: 'pablof.prieto@telefonica.com',
        subject: 'Intervención Enviada',
        text: `Tipo de Trabajo: ${tipoTrabajo}\nDirección: ${direccion}`,
        attachments: imagenes.map(imagen => ({
            filename: imagen,
            path: path.join(__dirname, 'uploads', imagen)
        }))
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error enviando el correo:', error);
            return res.status(500).json({ success: false, message: 'Error al enviar el correo.' });
        }
        console.log('Correo enviado:', info.response);
    });

    res.json({ success: true });
});

// Ruta para manejar el envío de reportes
app.post('/enviarReporte', upload.array('imagenesReporte', 3), (req, res) => {
    const { tipoReporte, comentarios } = req.body;
    const imagenesReporte = req.files.map(file => file.filename);

    if (!tipoReporte || !comentarios) {
        return res.json({ success: false, message: 'Faltan datos.' });
    }

    // Enviar a WhatsApp
    imagenesReporte.forEach(imagen => {
        const media = MessageMedia.fromFilePath(path.join(__dirname, 'uploads', imagen));
        client.sendMessage('+541136741002', media);
    });

    // Enviar correo electrónico
    const mailOptions = {
        from: 'tu-email@gmail.com',
        to: 'pablof.prieto@telefonica.com',
        subject: 'Reporte Enviado',
        text: `Tipo de Reporte: ${tipoReporte}\nComentarios: ${comentarios}`,
        attachments: imagenesReporte.map(imagen => ({
            filename: imagen,
            path: path.join(__dirname, 'uploads', imagen)
        }))
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error enviando el correo:', error);
            return res.status(500).json({ success: false, message: 'Error al enviar el correo.' });
        }
        console.log('Correo enviado:', info.response);
    });

    res.json({ success: true });
});

// Ruta para manejar el envío de materiales
app.post('/enviarMateriales', (req, res) => {
    const { tipoMaterial } = req.body;

    if (!tipoMaterial) {
        return res.json({ success: false, message: 'Faltan datos.' });
    }

    // Enviar a WhatsApp
    client.sendMessage('+541136741002', `Pedido de Materiales: ${tipoMaterial}`);

    // Enviar correo electrónico
    const mailOptions = {
        from: 'tu-email@gmail.com',
        to: 'pablof.prieto@telefonica.com',
        subject: 'Pedido de Materiales',
        text: `Tipo de Material: ${tipoMaterial}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error enviando el correo:', error);
            return res.status(500).json({ success: false, message: 'Error al enviar el correo.' });
        }
        console.log('Correo enviado:', info.response);
    });

    res.json({ success: true });
});

// Inicializar cliente de WhatsApp
client.initialize();

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
