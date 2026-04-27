const UsersService = require("../services/users-service");

const addUser = async (req, res) => {
  try {
    const { name, email, password, admin, planId } = req.body;
    const newUser = await UsersService.addUser({
      name,
      email,
      password,
      admin,
      planId,
    });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.message === "EMAIL_ALREADY_IN_USE") {
      res.status(409).json({ message: "El email se encuentra en uso" });
    } else if (error.message === "PLAN_ID_REQUIRED") {
      res.status(400).json({ message: "Se requiere haber solicitado un plan" });
    } else {
      res.status(500).json({ message: "Error interno en el servidor" });
    }
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await UsersService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS") {
      res.status(401).json({ message: "Email o contraseña incorrectos" });
    } else {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
};

const recoverPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await UsersService.requestPaswordRecovery(email);
    res.status(200).json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await UsersService.resetPassword(token, newPassword);
    res.status(200).json({ message: "Contraseña restablecida exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  addUser,
  login,
  recoverPassword,
  resetPassword,
};
