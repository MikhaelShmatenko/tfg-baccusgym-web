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

module.exports = {
  getAllPlans,
};
