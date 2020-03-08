import { Op } from "sequelize";
import * as Yup from "yup";
import Queue from "../../lib/Queue";
import CancelDeliveryMail from "../jobs/CancelDeliveryMail";

import Delivery from "../models/Delivery";
import Recipient from "../models/Recipient";
import Deliveryman from "../models/Deliveryman";
import DeliveryProblem from "../models/DeliveryProblem";
import FileAvatar from "../models/FileAvatar";

class DeliveryProblemController {
  async index(req, res) {
    const problems = await DeliveryProblem.findAll({
      attributes: ["id", "description"],
      include: [
        {
          model: Delivery,
          as: "delivery",
          attributes: [
            "id",
            "product",
            "start_date",
            "end_date",
            "canceled_at"
          ],
          include: [
            {
              model: Deliveryman,
              as: "deliveryman",
              attributes: ["id", "name", "email"],
              include: [
                {
                  model: FileAvatar,
                  as: "avatar",
                  attributes: ["id", "path", "url"]
                }
              ]
            },
            {
              model: Recipient,
              as: "recipient",
              attributes: [
                "name",
                "adress",
                "number",
                "complement",
                "state",
                "city",
                "zipcode"
              ]
            }
          ]
        }
      ]
    });
    return res.json(problems);
  }

  async show(req, res) {
    const deliveryId = +req.params.id;

    const problems = await DeliveryProblem.findAll({
      where: { delivery_id: deliveryId },
      attributes: ["id", "description"],
      include: [
        {
          model: Delivery,
          as: "delivery",
          attributes: [
            "id",
            "product",
            "start_date",
            "end_date",
            "canceled_at"
          ],
          include: [
            {
              model: Deliveryman,
              as: "deliveryman",
              attributes: ["id", "name", "email"],
              include: [
                {
                  model: FileAvatar,
                  as: "avatar",
                  attributes: ["id", "path", "url"]
                }
              ]
            },
            {
              model: Recipient,
              as: "recipient",
              attributes: [
                "name",
                "adress",
                "number",
                "complement",
                "state",
                "city",
                "zipcode"
              ]
            }
          ]
        }
      ]
    });

    if (problems.length === 0) {
      return res.json({ Message: "No problems with this delivery" });
    }

    return res.json(problems);
  }

  async store(req, res) {
    const deliveryId = +req.body.delivery_id;

    const schema = Yup.object().shape({
      delivery_id: Yup.number().required(),
      description: Yup.string().required()
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ Error: "Validate fails" });
    }

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(400).json({ Error: "Delivery does not exists" });
    }

    if (delivery.canceled_at !== null) {
      return res
        .status(400)
        .json({ Error: "This delivery is already canceled" });
    }

    if (delivery.end_date !== null) {
      return res
        .status(400)
        .json({ Error: "This delivery is already finished" });
    }

    const problem = await DeliveryProblem.create(req.body);

    if (!problem) {
      return res
        .status(500)
        .json({ Error: "Something goes wrong with server, try again later" });
    }

    return res.json(problem);
  }

  async delete(req, res) {
    const id = +req.params.id;
    const canceledDate = new Date();

    const delivery = await Delivery.findByPk(id, {
      attributes: ["id", "product", "start_date", "end_date", "canceled_at"],
      include: [
        {
          model: Deliveryman,
          as: "deliveryman",
          attributes: ["id", "name", "email"]
        },
        {
          model: Recipient,
          as: "recipient",
          attributes: [
            "name",
            "adress",
            "number",
            "complement",
            "city",
            "state",
            "zipcode"
          ]
        }
      ]
    });

    await delivery.update({ canceled_at: canceledDate });

    await Queue.add(CancelDeliveryMail.key, { delivery });
    return res.json(delivery);
  }
}

export default new DeliveryProblemController();
