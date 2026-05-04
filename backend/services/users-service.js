const UsersModel = require("../models/users-model");
const UsersPlansModel = require("../models/user-plans-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");

class UsersService {
  async addUser(userData) {
    try {
      if (!userData.planId) {
        throw new Error("PLAN_ID_REQUIRED");
      }

      const existingUser = await UsersModel.findByEmail(userData.email);
      if (existingUser) {
        throw new Error("EMAIL_ALREADY_IN_USE");
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      const userDataWithHashedPassword = {
        ...userData,
        password: hashedPassword,
      };

      const newUser = await UsersModel.addUser(userDataWithHashedPassword);

      await UsersPlansModel.linkUserToPlan(newUser.iduser, userData.planId);

      delete newUser.password;
      return newUser;
    } catch (error) {
      if (
        error.message === "PLAN_ID_REQUIRED" ||
        error.message === "EMAIL_ALREADY_IN_USE"
      ) {
        throw error;
      }
      throw new Error("USER_CREATION_FAILED");
    }
  }

  async login(email, password) {
    let user;
    try {
      user = await UsersModel.findByEmail(email);
    } catch (error) {
      throw new Error("GETTING_MAIL_FAILED");
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const token = jwt.sign(
      {
        idUser: user.iduser,
        name: user.name,
        email: user.email,
        admin: user.admin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    return {
      token,
      idUser: user.iduser,
      name: user.name,
      email: user.email,
      admin: user.admin,
    };
  }

  async requestPaswordRecovery(email) {
    let user;
    try {
      user = await UsersModel.findByEmail(email);
    } catch (error) {
      throw new Error("GETTING_MAIL_FAILED");
    }
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    const recoveryToken = jwt.sign(
      { email: user.email, type: "recovery" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    const resetPasswordLink = `${process.env.FRONTEND_URL}/user/reset-password?token=${recoveryToken}`;
    await transporter.sendMail({
      from: '"Baccus Gym" <noreply@baccusgym.com>',
      to: user.email,
      subject: "Recuperación de contraseña - Baccus Gym",
      html: `<p>Hola ${user.name},</p>
      <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
      <a href="${resetPasswordLink}">Restablecer contraseña</a>
      <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      <p>Saludos,<br/>El equipo de Baccus Gym</p>`,
    });
  }

  async resetPassword(token, newPassword) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.type !== "recovery") {
        throw new Error("INVALID_TOKEN_TYPE");
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await UsersModel.updatePassword(decoded.email, hashedPassword);
    } catch (error) {
      if (error.name === "TokenExpiredError") throw new Error("TOKEN_EXPIRED");
      if (error.name === "JsonWebTokenError") throw new Error("INVALID_TOKEN");
      throw error;
    }
  }

  async getUserDetails(idUser) {
    let userDetails;
    try {
      userDetails = await UsersModel.getUserFullDetails(idUser);
    } catch (error) {
      throw new Error("GETTING_USER_DETAILS_FAILED");
    }

    if (!userDetails) {
      throw new Error("USER_NOT_FOUND");
    }
    return userDetails;
  }

  async getAllUsersDetails() {
    try {
      const users = await UsersModel.getAllUsersFullDetails();
      if (!users) {
        throw new Error("USERS_NOT_FOUND");
      }
      return users;
    } catch (error) {
      if (error.message === "USERS_NOT_FOUND") {
        throw error;
      }
      throw new Error("GETTING_ALL_USERS_DETAILS_FAILED");
    }
  }

  async deleteAccount(idUser) {
    let deleted;
    try {
      deleted = await UsersModel.deleteUser(idUser);
    } catch (error) {
      throw new Error("DELETE_USER_FAILED");
    }

    if (!deleted) {
      throw new Error("USER_NOT_FOUND");
    }

    return { message: "Cuenta eliminada correctamente" };
  }

  async changePassword(idUser, currentPassword, newPassword) {
    try {
      const user = await UsersModel.findById(idUser);
      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new Error("INVALID_CURRENT_PASSWORD");
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await UsersModel.updatePasswordById(idUser, hashedPassword);

      return { message: "Contraseña actualizada correctamente" };
    } catch (error) {
      if (
        error.message === "USER_NOT_FOUND" ||
        error.message === "INVALID_CURRENT_PASSWORD"
      ) {
        throw error;
      }
      throw new Error("CHANGE_PASSWORD_FAILED");
    }
  }

  async updateUserName(idUser, password, newName) {
    try {
      const user = await UsersModel.findById(idUser);
      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("INVALID_PASSWORD");
      }

      const updatedUser = await UsersModel.updateName(idUser, newName);
      return updatedUser;
    } catch (error) {
      if (
        error.message === "USER_NOT_FOUND" ||
        error.message === "INVALID_PASSWORD"
      ) {
        throw error;
      }
      throw new Error("UPDATE_NAME_FAILED");
    }
  }
}

module.exports = new UsersService();
