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
    if (error.message === "TOKEN_EXPIRED") {
      res.status(401).json({ message: "El enlace ha caducado" });
    } else if (
      error.message === "INVALID_TOKEN" ||
      error.message === "INVALID_TOKEN_TYPE"
    ) {
      res
        .status(400)
        .json({ message: "El enlace de recuperación no es válido" });
    } else {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
};

const getUserDetails = async (req, res) => {
  try {
    const idUser = req.user.idUser;
    const userDetails = await UsersService.getUserDetails(idUser);
    res.status(200).json(userDetails);
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
};

const getAllUsersDetails = async (req, res) => {
  try {
    const allUsers = await UsersService.getAllUsersDetails();
    res.status(200).json(allUsers);
  } catch (error) {
    if (error.message === "USERS_NOT_FOUND") {
      res.status(404).json({ message: "Usuarios no encontrados" });
    } else {
      res
        .status(500)
        .json({ message: "Error al obtener la lista de usuarios" });
    }
  }
};

const deleteAccount = async (req, res) => {
  try {
    const idUser = req.user.idUser;
    await UsersService.deleteAccount(idUser);
    res
      .status(200)
      .json({ message: "Tu cuenta a sido eliminada correctamente" });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      res.status(500).json({ message: "Error al intentar eliminar la cuenta" });
    }
  }
};

const changePassword = async (req, res) => {
  try {
    const idUser = req.user.idUser;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    await UsersService.changePassword(idUser, currentPassword, newPassword);

    return res
      .status(200)
      .json({ message: "Contraseña actualizada con exito" });
  } catch (error) {
    if (error.message === "INVALID_CURRENT_PASSWORD") {
      res.status(401).json({ message: "La contraseña actual no es correcta" });
    } else if (error.message === "USER_NOT_FOUND") {
      res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      res
        .status(500)
        .json({ message: "Error interno al intentar cambiar la contraseña" });
    }
  }
};

const changeName = async (req, res) => {
  try {
    const idUser = req.user.idUser;
    const { password, newName } = req.body;

    if (!password || !newName) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const user = await UsersService.updateUserName(idUser, password, newName);

    res
      .status(200)
      .json({ message: "Nombre de usuario actualizado con éxito" });
  } catch (error) {
    if (error.message === "INVALID_PASSWORD") {
      res.status(401).json({ message: "La contraseña no es correcta" });
    } else if (error.message === "USER_NOT_FOUND") {
      res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      res
        .status(500)
        .json({ message: "Error interno al intentar cambiar el nombre" });
    }
  }
};

module.exports = {
  addUser,
  login,
  recoverPassword,
  resetPassword,
  getUserDetails,
  deleteAccount,
  changePassword,
  changeName,
  getAllUsersDetails,
};
