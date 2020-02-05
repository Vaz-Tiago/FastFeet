import * as Yup from "yup";

import Recipient from "../models/Recipient";

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      adress: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.number().required()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validate fails" });
    }

    const nameExists = await Recipient.findOne({
      where: { name: req.body.name }
    });
    if (nameExists) {
      return res.status(400).json({ error: "This recipient already exists." });
    }

    const {
      id,
      name,
      adress,
      number,
      complement,
      state,
      city,
      zipcode
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      adress,
      number,
      complement,
      state,
      city,
      zipcode
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string(),
      adress: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zipcode: Yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validate fails" });
    }

    const recipient = await Recipient.findByPk(req.body.id);

    const {
      name,
      adress,
      number,
      complement,
      state,
      city,
      zipcode
    } = await recipient.update(req.body);

    return res.json({
      name,
      adress,
      number,
      complement,
      state,
      city,
      zipcode
    });
  }
}

export default new RecipientController();
