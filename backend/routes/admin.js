const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users-controller");
const userPlansController = require("../controllers/user-plans-controller");
const templateController = require("../controllers/template-controller");
const templateExercisesController = require("../controllers/template-exercises-controller");
const exerciseTutorialController = require("../controllers/exercise-tutorial-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");
const upload = require("../config/upload");
const { use } = require("../config/mailer");

router.post(
  "/add-template",
  authMiddleware,
  adminMiddleware,
  templateController.addTemplate,
);

router.post(
  "/add-exercise-template",
  authMiddleware,
  adminMiddleware,
  templateExercisesController.addExerciseToTemplate,
);

router.post(
  "/add-user",
  authMiddleware,
  adminMiddleware,
  usersController.addUser,
);

router.put(
  "/set-user-plan",
  authMiddleware,
  adminMiddleware,
  userPlansController.setUserPlan,
);

router.put(
  "/substract-day/:iduser",
  authMiddleware,
  adminMiddleware,
  userPlansController.substarctDay,
);

router.put(
  "/deactivate-plan/:iduser",
  authMiddleware,
  adminMiddleware,
  userPlansController.deactivatePlan,
);

router.get(
  "/all-users-details",
  authMiddleware,
  adminMiddleware,
  usersController.getAllUsersDetails,
);

router.get(
  "/all-templates",
  authMiddleware,
  adminMiddleware,
  templateController.getAllTemplates,
);

router.delete(
  "/delete-template/:idtemplate",
  authMiddleware,
  adminMiddleware,
  templateController.deleteTemplate,
);

router.post(
  "/add-exercise-tutorial",
  authMiddleware,
  adminMiddleware,
  (req, res, next) => {
    upload.single("video")(req, res, (err) => {
      if (err) {
        if (err.message === "INVALID_FILE_TYPE") {
          return res.status(400).json({ message: "Solo se permiten archivos de vídeo." });
        }
        if (err.message === "DUPLICATE_FILE") {
          return res.status(409).json({ message: "Ya existe un tutorial con ese nombre de archivo." });
        }
        return next(err);
      }
      next();
    });
  },
  exerciseTutorialController.addExerciseTutorial,
);

router.get(
  "/all-exercise-tutorials",
  authMiddleware,
  adminMiddleware,
  exerciseTutorialController.getAllExerciseTutorials,
);

router.delete(
  "/delete-exercise-tutorial/:id",
  authMiddleware,
  adminMiddleware,
  exerciseTutorialController.deleteExerciseTutorial,
);

module.exports = router;
