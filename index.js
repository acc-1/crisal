const express = require('express');
const cors = require('cors');
const Resend = require('resend').Resend;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "*/*" }));

app.use(cors({
    origin: ['https://crisal-consultora.netlify.app', 'https://crisal.netlify.app'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true // If you need to send cookies or HTTP Authentication information
}));

app.options('*', cors()); // Handle preflight requests

app.get('/', (req, res) => {
    const htmlResponse = `
    <html>
        <head> <title> funciona </title> </head>
        <body>
        <h1> Soy un proyecto backend en vercel</h1>
        </body>
    </html>`;
    res.send(htmlResponse);
});

let datosCompletos = [];

app.post('/formdata', async (req, res) => {
    console.log("funciona");
    try {
        const datos = req.body;
        datosCompletos.push(datos);
        await enviarCorreoElectronico(datos);
        res.status(200).send('Datos recibidos correctamente');
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar los datos');
    }
});

async function enviarCorreoElectronico(datos) {
    const resend = new Resend('re_12egN1hR_KgaHzMiAgG82GzEeSD9iW3d8'); // Replace with your Resend API key
    const htmlContent = `<p>
        <strong>COMPANY NAME:</strong> ${datos.companyName}<br><br><br>
        <strong>RAZON SOCIAL:</strong> ${datos.razonSocial}<br><br><br>
        <strong>CUIT:</strong> ${datos.cuit}<br><br><br>
        <strong>CONTACT PHONE:</strong> ${datos.contactPhone}<br><br><br>
        <strong>CONTACT EMAIL:</strong> ${datos.contactEmail}<br><br><br>
        <strong>DIRECCION:</strong> ${datos.direccion}<br><br><br>
        <strong>CODIGO POSTAL:</strong> ${datos.codigoPostal}<br><br><br>
        <strong>LOCALIDAD:</strong> ${datos.localidad}<br><br><br>
        <strong>REFERENCIA:</strong> ${datos.referencia}<br><br><br>
    </p>`;

    const emailOptions = {
        from: 'Crisal Consultora<onboarding@resend.dev>',
        to: ['info.crisal.consultora@gmail.com'],
        subject: 'Nuevo Cliente',
        html: htmlContent,
    };

    const { data, error } = await resend.emails.send(emailOptions);

    if (error) {
        console.error('Error al enviar el correo electrónico:', error);
    } else {
        console.log('Correo electrónico enviado correctamente:', data);
    }
}

app.listen(port, () => {
    console.log(`Estoy ejecutandome en http://localhost:${port}`)
});
