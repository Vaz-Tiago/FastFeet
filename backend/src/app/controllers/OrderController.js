import { Op } from "sequelize";
import * as Yup from "yup";
import { getHours, startOfDay, endOfDay } from "date-fns";

import Delivery from "../models/Delivery";
import Deliveryman from "../models/Deliveryman";
import FileAvatar from "../models/FileAvatar";
import FileSignature from "../models/FileSignature";
import Recipient from "../models/Recipient";

class OrderController {
  async show(req, res) {
    const deliveryman = req.params.id;
    const { page = 1 } = req.query;

    const orders = await Delivery.findAll({
      where: {
        deliveryman_id: deliveryman,
        [Op.and]: [{ end_date: null }, { canceled_at: null }]
      },
      attributes: ["id", "product", "start_date", "end_date"],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
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
    });

    if (!orders) {
      return res.json({ MSG: "There are no orders for you" });
    }
    return res.json(orders);
  }

  async startOrder(req, res) {
    const deliveryman = +req.params.id;
    const { id } = req.body;

    const schema = Yup.object().shape({
      id: Yup.number().required()
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ Error: "Validate fails" });
    }

    const order = await Delivery.findByPk(id);
    if (order.deliveryman_id !== deliveryman) {
      return res
        .status(400)
        .json({ Error: "This delivery does not belong to you" });
    }
    if (
      !(
        order.canceled_at === null &&
        order.start_date === null &&
        order.end_date === null
      )
    ) {
      res.status(400).json({ Error: "This Delivery is unavailable" });
    }

    const checkDeliveries = await Delivery.findAndCountAll({
      where: {
        deliveryman_id: deliveryman,
        [Op.and]: {
          start_date: {
            [Op.between]: [startOfDay(new Date()), endOfDay(new Date())]
          }
        }
      }
    });

    if (checkDeliveries.count >= 5) {
      return res
        .status(400)
        .json({ Error: "You can only make five deliveries a day" });
    }

    const checkHour = getHours(new Date());
    if (checkHour < 8 || checkHour > 18) {
      return res
        .status(400)
        .json({ Error: "You can only take an order between 8 am and 6 pm" });
    }

    await order.update({ start_date: new Date() });

    return res.json(order);
  }

  async finishOrder(req, res) {
    const deliveryman = +req.params.id;
    const delivery = +req.body.id;
    const { originalname: name, filename: path } = req.file;

    const schema = Yup.object().shape({
      id: Yup.number().required()
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ Error: "Validate fails" });
    }

    const checkDeliveryman = await Deliveryman.findByPk(deliveryman);

    if (!checkDeliveryman) {
      return res.status(400).json({ Error: "Deliveryman does not exists" });
    }

    let order = await Delivery.findByPk(delivery);

    // Check Delivery Exists
    if (!order) {
      return res.status(400).json({ Error: "Delivery does not exists" });
    }

    // Check if deliveryman is really responsible of delivery
    if (order.deliveryman_id !== deliveryman) {
      return res
        .status(400)
        .json({ Error: "You is not responsible for this delivery" });
    }

    // Check if order is already started
    if (order.start_date === null) {
      return res.status(400).json({ Error: "You need start delivery first" });
    }

    // Check if order is already deliveried
    if (order.end_date !== null) {
      return res
        .status(400)
        .json({ Error: "This order is already deliveried" });
    }

    const signature = await FileSignature.create({
      name,
      path
    });

    if (!signature) {
      return res
        .status(500)
        .json({ Error: "Something wrong with the signature upload" });
    }

    await order.update({
      end_date: new Date(),
      signature_id: signature.id
    });

    order = await Delivery.findByPk(delivery, {
      attributes: ["id", "product", "start_date", "end_date"],
      include: [
        {
          model: FileSignature,
          as: "signature",
          attributes: ["id", "path", "url"]
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
        },
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
        }
      ]
    });

    return res.json(order);
  }
}

export default new OrderController();
