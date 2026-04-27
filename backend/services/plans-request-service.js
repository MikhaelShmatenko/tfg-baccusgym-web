const PlansModel = require("../models/plans-model");
const transporter = require("../config/mailer");

class PlanRequestService {
  async processPlanRequest(data) {
    if (data.acceptTerms !== true) {
      throw new Error("TERMS_NOT_ACCEPTED");
    }

    let plan;
    try {
      plan = await PlansModel.getPlanById(data.planId);
    } catch (error) {
      throw new Error("GETTING_PLAN_FAILED");
    }

    if (!plan) {
      throw new Error("PLAN_NOT_FOUND");
    }

    await transporter.sendMail({
      from: '"Sistema de Solicitudes Baccus" <noreply@baccusgym.com>',
      to: "mikhael88888@gmail.com",
      subject: `Nueva solicitud de Plan: ${plan.name} - ${data.name} ${data.lastName}`,
      html: `
        <h1>Nueva solicitud de inscripción</h1>
        <p>Se ha recibido una nueva solicitud de plan desde la web:</p>
        <hr/>
        <h3>Datos del Usuario:</h3>
        <ul>
          <li><strong>Nombre:</strong> ${data.name} ${data.lastName}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>DNI:</strong> ${data.dni}</li>
          <li><strong>Dirección:</strong> ${data.address}</li>
          <li><strong>IBAN:</strong> ${data.iban}</li>
        </ul>
        <h3>Detalles del Plan solicitado:</h3>
        <ul>
          <li><strong>Plan:</strong> ${plan.name}</li>
          <li><strong>Precio:</strong> ${plan.price}€</li>
          <li><strong>ID Plan:</strong> ${plan.idplan}</li>
        </ul>
        <hr/>
        <p><strong>El usuario ha aceptado los términos y condiciones.</strong></p>
      `,
    });
  }
}

module.exports = new PlanRequestService();
