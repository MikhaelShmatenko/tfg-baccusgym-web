const TemplateService = require("../services/template-service");

const addTemplate = async (req, res) => {
  try {
    const { name, description, type } = req.body;

    if (!name || !type) {
      res.status(400).json({ message: "El nombre y el tipo son obligatorios" });
    }

    const template = await TemplateService.addTemplate(name, description, type);

    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: "Error interno al crear la plantilla" });
  }
};

const getAllTemplates = async (req, res) => {
  try {
    const templates = await TemplateService.getFullTemplatesList();
    res.status(200).json(templates);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el listado de plantillas" });
  }
};

const deleteTemplate = async (req, res) => {
  try {
    const { idtemplate } = req.params;

    if (!idtemplate) {
      return res
        .status(400)
        .json({ message: "El id de la plantilla es obligatorio" });
    }

    await TemplateService.deleteTemplate(idtemplate);
    res.status(200).json({ message: "Plantilla eliminada correctamente" });
  } catch (error) {
    if (error.message === "TEMPLATE_NOT_FOUND") {
      res.status(404).json({ message: "La plantilla no existe" });
    } else {
      res.status(500).json({ message: "Error al eliminar la plantilla" });
    }
  }
};

module.exports = {
  addTemplate,
  getAllTemplates,
  deleteTemplate,
};
