const TemplateModel = require("../models/template-model");

class TemplateService {
  async addTemplate(name, description, type) {
    try {
      const newTemplate = await TemplateModel.createTemplate(
        name,
        description,
        type,
      );
      return newTemplate;
    } catch (error) {
      throw new Error("TEMPLATE_CREATION_FAILED");
    }
  }

  async getFullTemplatesList() {
    try {
      const rows = await TemplateModel.getAllTemplatesWithExercises();
      const templatesMap = rows.reduce((acc, row) => {
        const { idtemplate, template_name, description, type, ...exercise } =
          row;

        if (!acc[idtemplate]) {
          acc[idtemplate] = {
            idtemplate,
            name: template_name,
            description,
            type,
            exercises: [],
          };
        }

        if (exercise.idtemplate_exercise) {
          acc[idtemplate].exercises.push(exercise);
        }

        return acc;
      }, {});
      return Object.values(templatesMap);
    } catch (error) {
      throw new Error("GET_TEMPLATES_FAILED");
    }
  }

  async deleteTemplate(idtemplate) {
    try {
      const template = await TemplateModel.getTemplateById(idtemplate);
      if (!template) {
        throw new Error("TEMPLATE_NOT_FOUND");
      }

      await TemplateModel.deleteTemplate(idtemplate);
      return true;
    } catch (error) {
      if (error.message === "TEMPLATE_NOT_FOUND") {
        throw error;
      }
      {
        throw new Error("DELETE_TEMPLATE_FAILED");
      }
    }
  }
}

module.exports = new TemplateService();
