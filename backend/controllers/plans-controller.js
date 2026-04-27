const PlansService = require("../services/plans-service");

const getAllPlans = async (req, res) => {
  try {
    const plans = await PlansService.getAllPlans();
    res.status(200).json(plans);
  } catch (error) {
    if (error.message === "NO_PLANS_FOUND") {
      res.status(404).json({ message: "No se encontraron planes disponibles" });
    } else {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
};

const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await PlansService.getPlanById(id);
    res.status(200).json(plan);
  } catch (error) {
    if (error.message === "PLAN_NOT_FOUND") {
      res.status(404).json({ message: "El plan solicitado no existe" });
    } else {
      res.status(500).json({ message: "Error al obtener el plan" });
    }
  }
};

module.exports = {
  getAllPlans,
  getPlanById,
};
