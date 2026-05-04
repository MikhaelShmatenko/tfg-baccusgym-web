const UserPlansService = require("../services/user-plans-service");

const setUserPlan = async (req, res) => {
  try {
    const { iduser, idplan, start_date, is_active } = req.body;

    if (!iduser || !idplan || !start_date) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const updatedPlan = await UserPlansService.setUserPlan(
      iduser,
      idplan,
      start_date,
      is_active,
    );

    res.status(200).json(updatedPlan);
  } catch (error) {
    if (error.message === "PLAN_NOT_FOUND") {
      res.status(404).json({ message: "El plan solicitado no existe" });
    } else {
      res.status(500).json({ message: "Error al actualizar el plan" });
    }
  }
};

const substarctDay = async (req, res) => {
  try {
    const { iduser } = req.params;

    if (!iduser) {
      return res.status(400).json({ message: "Usuario requerido" });
    }

    const updatedPlan = await UserPlansService.substractDay(iduser);

    res.status(200).json(updatedPlan);
  } catch (error) {
    if (error.message === "NO_ACTIVE_BONO_PLAN") {
      res.status(404).json({
        message:
          "El usuario no tiene un plan de bonos activo o ya no le quedan días",
      });
    } else {
      res.status(500).json({ message: "Error al restar el día del bono" });
    }
  }
};

const deactivatePlan = async (req, res) => {
  try {
    const { iduser } = req.params;
    if (!iduser) {
      return res.status(400).json({ message: "Usuario requerido" });
    }

    const updatedPlan = await UserPlansService.deactivatePlan(iduser);
    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: "Error al desactivar el plan" });
  }
};

module.exports = {
  setUserPlan,
  substarctDay,
  deactivatePlan,
};
