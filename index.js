const express = require('express')
const cors = require('cors')
const Resend = require('resend').Resend;

const app = express()
const port = process.env.PORT || 3000
//#region
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(
    express.json({
        type: "*/*"
    })
)
app.use(cors({
    origin: ['https://crisal-consultora.netlify.app/']
}));
//#endregion
app.get('/', (req,res)=>{
    const htmlResponse=`
    <html>
     <head> <title> funciona </title>  </head>
     <body>
     <h1> Soy un proyecto backend en vercel</h1>
     </body>
     </html>
    `;
    res.send(htmlResponse);
})

// app.post('/formdata', (req, res) => {
//     console.log('Datos recibidos:', req.body);
    
// });
let datosCompletos = [];
app.post('/formdata', async (req, res) => {
    console.log("funciona")
    try {
        // Obtener los datos del cuerpo de la solicitud
        const datos = req.body;

        // Almacenar los datos en el array de datos completos
        datosCompletos.push(datos);

        // Procesar los datos (enviar correo electrónico, etc.)
        await enviarCorreoElectronico(datos);

        // Respuesta al cliente
        res.status(200).send('Datos recibidos correctamente');
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar los datos');
    }
});

async function enviarCorreoElectronico(datos) {
    const resend = new Resend('re_1KbYx6kP_5KTCEimwb8cTJfCyTQNcHSGg'); // Reemplaza con tu clave de API de Resend

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
        to: ['agusalt2004@hotmail.com'],
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
})