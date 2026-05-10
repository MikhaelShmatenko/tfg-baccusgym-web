const ExerciseTutorialModel = require("../models/exercise-tutorial-model");
const path = require("path");
const fs = require("fs");

class ExerciseTutorialService {
  async addExerciseTutorial({ name, description, url_video }) {
    try {
      if (!name || !description || !url_video) {
        throw new Error("MISSING_FIELDS");
      }
      const newTutorial = await ExerciseTutorialModel.addExerciseTutorial({
        name,
        description,
        url_video,
      });
      return newTutorial;
    } catch (error) {
      if (error.message === "MISSING_FIELDS") {
        throw error;
      }
      throw new Error("TUTORIAL_CREATION_FAILED");
    }
  }

  async getAllExerciseTutorials() {
    try {
      return await ExerciseTutorialModel.getAllExerciseTutorials();
    } catch (error) {
      throw new Error("GET_TUTORIALS_FAILED");
    }
  }

  async deleteExerciseTutorial(id) {
    try {
      const tutorial = await ExerciseTutorialModel.getExerciseTutorialById(id);
      if (!tutorial) {
        throw new Error("TUTORIAL_NOT_FOUND");
      }
      const filePath = path.join(
        __dirname,
        "../public/videos/exercise-tutorials",
        tutorial.url_video,
      );
      try {
        fs.unlinkSync(filePath);
      } catch {}
      const deleted = await ExerciseTutorialModel.deleteExerciseTutorial(id);
      if (!deleted) {
        throw new Error("TUTORIAL_NOT_FOUND");
      }
      return true;
    } catch (error) {
      if (error.message === "TUTORIAL_NOT_FOUND") {
        throw error;
      }
      throw new Error("DELETE_TUTORIAL_FAILED");
    }
  }
}

module.exports = new ExerciseTutorialService();
