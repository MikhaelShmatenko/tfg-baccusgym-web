const UsersModel = require("../models/users-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");

class UsersService {
  async addUser(userData) {
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
    delete newUser.password;
    return newUser;
  }

  async login(email, password) {
    const user = await UsersModel.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("INVALID_CREDENTIALS");
    }
    const token = jwt.sign(
      {
        idUser: user.iduser,
        name: user.name,
        email: user.email,
        admin: user.admin,
        planStatus: user.planstatus,
        idPlan: user.idplan,
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
      planStatus: user.planstatus,
      idPlan: user.idplan,
    };
  }

  async requestPaswordRecovery(email) {
    const user = await UsersModel.findByEmail(email);
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
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      await UsersModel.updatePassword(decoded.email, hashedPassword);
    } catch (error) {
      throw new Error("INVALID_TOKEN");
    }
  }
}

module.exports = new UsersService();
