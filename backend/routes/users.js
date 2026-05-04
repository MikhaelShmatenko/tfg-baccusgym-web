var express = require("express");
var router = express.Router();
const usersController = require("../controllers/users-controller");
const templateController = require("../controllers/template-controller");
const authMiddleware = require("../middlewares/auth-middleware");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post("/register", usersController.addUser);

router.post("/login", usersController.login);

router.post("/recover-password", usersController.recoverPassword);

router.get("/details", authMiddleware, usersController.getUserDetails);

router.get(
  "/all-templates",
  authMiddleware,
  templateController.getAllTemplates,
);

router.put("/reset-password", usersController.resetPassword);

router.put("/change-password", authMiddleware, usersController.changePassword);

router.put("/change-name", authMiddleware, usersController.changeName);

router.delete("/delete", authMiddleware, usersController.deleteAccount);

module.exports = router;
