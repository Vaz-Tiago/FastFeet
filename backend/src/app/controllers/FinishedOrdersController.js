import { Op } from "sequelize";

import Delivery from "../models/Delivery";
import Recipient from "../models/Recipient";
import FileSignature from "../models/FileSignature";

class FinishedOrdersController {
  async show(req, res) {
    const deliveryman = +req.params.id;
    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: deliveryman,
        [Op.or]: { [Op.not]: { end_date: null } }
      },
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ["id", "product", "start_date", "end_date", "canceled_at"],
      include: [
        {
          model: Recipient,
          as: "recipient",
          attributes: ["id", "name", "adress", "number"]
        },
        {
          model: FileSignature,
          as: "signature",
          attributes: ["id", "path", "url"]
        }
      ]
    });

    if (!deliveries) {
      return res.status(400).json({ Error: "No results" });
    }

    if (deliveries.length === 0) {
      return res.json({ Message: "No delivery found" });
    }

    return res.json(deliveries);
  }
}

export default new FinishedOrdersController();
