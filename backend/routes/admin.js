const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users-controller");
const userPlansController = require("../controllers/user-plans-controller");
const templateController = require("../controllers/template-controller");
const templateExercisesController = require("../controllers/template-exercises-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");
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

module.exports = router;
