const UsersModel = require("../models/users-model");
const UsersPlansModel = require("../models/user-plans-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");

class UsersService {
  async addUser(userData) {
    if (!userData.planId) {
      throw new Error("PLAN_ID_REQUIRED");
    }

    let existingUser;
    try {
      existingUser = await UsersModel.findByEmail(userData.email);
    } catch (error) {
      throw new Error("GETTING_MAIL_FAILED");
    }

    if (existingUser) {
      throw new Error("EMAIL_ALREADY_IN_USE");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const userDataWithHashedPassword = {
      ...userData,
      password: hashedPassword,
    };

    let newUser;
    try {
      newUser = await UsersModel.addUser(userDataWithHashedPassword);
    } catch (error) {
      throw new Error("USER_CREATION_FAILED");
    }

    try {
      await UsersPlansModel.linkUserToPlan(newUser.iduser, userData.planId);
    } catch (error) {
      throw new Error("PLAN_LINK_FAILED");
    }

    delete newUser.password;
    return newUser;
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
      { email: user.email },
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    try {
      await UsersModel.updatePassword(decoded.email, hashedPassword);
    } catch (error) {
      throw new Error("UPDATE_PASSWORD_FAILED");
    }
  }
}

module.exports = new UsersService();
