import * as Yup from "yup";

import Queue from "../../lib/Queue";
import NewDeliveryMail from "../jobs/NewDeliveryMail";

import Delivery from "../models/Delivery";
import Deliveryman from "../models/Deliveryman";
import Recipient from "../models/Recipient";
import FileAvatar from "../models/FileAvatar";

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      where: { canceled_at: null },
      order: ["updated_at"],
      attributes: [
        "id",
        "product",
        "start_date",
        "end_date",
        "created_at",
        "updated_at"
      ],
      limit: 10,
      offset: (page - 1) * 10,
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
            "id",
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
    });
    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
      recipient_id: Yup.number().required(),
      product: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: "Validate fails" });
    }

    // Check recipient id is valid
    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id);
    if (!deliveryman) {
      return res
        .status(400)
        .json({ Error: "Deliveryman not found. Check the ID and try again" });
    }

    // Check recipient id is valid
    const recipient = await Recipient.findByPk(req.body.recipient_id);
    if (!recipient) {
      return res
        .status(400)
        .json({ Error: "Recipient not found. Check the ID and try again" });
    }

    const newDelivery = await Delivery.create(req.body);

    if (!newDelivery) {
      return res
        .status(500)
        .json({ Error: "Something goes wrong with server, try again later" });
    }

    const delivery = await Delivery.findByPk(newDelivery.id, {
      attributes: ["id", "product"],
      include: [
        {
          model: Deliveryman,
          as: "deliveryman",
          attributes: ["name", "email"]
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

    await Queue.add(NewDeliveryMail.key, {
      delivery
    });

    return res.json(delivery);
  }

  async update(req, res) {
    return res.json({ msg: "update" });
  }

  async delete(req, res) {
    return res.json({ msg: "delete" });
  }
}

export default new DeliveryController();
