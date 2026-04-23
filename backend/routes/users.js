var express = require("express");
var router = express.Router();
const usersController = require("../controllers/users-controller");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post("/user/register", usersController.addUser);

router.post("/user/login", usersController.login);

router.post("/user/recover-password", usersController.recoverPassword);

router.put("/user/reset-password", usersController.resetPassword);

module.exports = router;
