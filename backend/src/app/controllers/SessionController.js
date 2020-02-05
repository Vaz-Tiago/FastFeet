import jwt from "jsonwebtoken";
import * as Yup from "yup";

import authConfig from "../../config/authConfig";
import User from "../models/User";

class SessionController {
  async store(req, res) {
    const shcema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required()
    });
    if (!(await shcema.isValid(req.body))) {
      return res.status(400).json({ erros: "Validation Fails" });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(401)
        .json({ error: "User does not exist. Check your email and try again" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Password does not match." });
    }

    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }
}

export default new SessionController();
