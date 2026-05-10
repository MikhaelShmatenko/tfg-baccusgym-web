const transporter = require("../config/mailer");

class ContactService {
  async sendMessage(data) {
    const { name, second_name, email, subject, text } = data;

    if (!name || !second_name || !email || !subject || !text) {
      throw new Error("MISSING_FIELDS");
    }

    await transporter.sendMail({
      from: '"Formulario de Contacto Baccus" <noreply@baccusgym.com>',
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Nuevo mensaje de contacto: ${subject} - ${name} ${second_name}`,
      html: `
        <h1>Nuevo mensaje de contacto</h1>
        <p>Se ha recibido un nuevo mensaje desde el formulario de contacto de la web:</p>
        <hr/>
        <h3>Datos del remitente:</h3>
        <ul>
          <li><strong>Nombre:</strong> ${name} ${second_name}</li>
          <li><strong>Email:</strong> ${email}</li>
        </ul>
        <h3>Mensaje:</h3>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p>${text}</p>
        <hr/>
        <p><em>Puedes responder directamente a este correo para contestar al usuario.</em></p>
      `,
    });
  }
}

module.exports = new ContactService();
