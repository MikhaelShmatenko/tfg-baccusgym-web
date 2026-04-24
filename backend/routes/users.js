var express = require("express");
var router = express.Router();
const usersController = require("../controllers/users-controller");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post("/register", usersController.addUser);

router.post("/login", usersController.login);

router.post("/recover-password", usersController.recoverPassword);

router.put("/reset-password", usersController.resetPassword);

module.exports = router;
