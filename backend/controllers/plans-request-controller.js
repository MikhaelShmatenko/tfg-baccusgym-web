const plansRequestService = require("../services/plans-request-service");

const createRequest = async (req, res) => {
  try {
    const requestData = req.body;
    await plansRequestService.processPlanRequest(requestData);
    res
      .status(201)
      .json({ message: "Solicitud procesada y enviada correctamente" });
  } catch (error) {
    if (error.message === "PLAN_NOT_FOUND") {
      res.status(404).json({ message: "El plan seleccionado no es valido" });
    } else if (error.message === "TERMS_NOT_ACCEPTED") {
      res.status(404).json({ message: "Los terminos no han sido aceptados" });
    } else {
      res
        .status(500)
        .json({ message: "Error interno al procesar la solicitud" });
    }
  }
};

module.exports = {
  createRequest,
};
