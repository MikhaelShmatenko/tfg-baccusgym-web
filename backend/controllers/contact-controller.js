const contactService = require("../services/contact-service");

const sendMessage = async (req, res) => {
  try {
    const contactData = req.body;
    await contactService.sendMessage(contactData);
    res.status(200).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    if (error.message === "MISSING_FIELDS") {
      res.status(400).json({ message: "Todos los campos son obligatorios" });
    } else {
      res.status(500).json({ message: "Error interno al enviar el mensaje" });
    }
  }
};

module.exports = {
  sendMessage,
};
