import Queue from "../../lib/Queue";
import CancelDeliveryMail from "../jobs/CancelDeliveryMail";

import Delivery from "../models/Delivery";
import Recipient from "../models/Recipient";
import Deliveryman from "../models/Deliveryman";
import DeliveryProblem from "../models/DeliveryProblem";

class DeliveryProblemController {
  async index(req, res) {
    return res.json({ msg: "Problem index" });
  }

  async show(req, res) {
    return res.json({ msg: "Problem show" });
  }

  async store(req, res) {
    return res.json({ msg: "Problem store" });
  }

  async delete(req, res) {
    // If delivery id === null, update delivery canceled_at
    // Check boolean for cancelation
    const id = +req.params.id;
    const delivery = await Delivery.findByPk(id, {
      attributes: ["id", "product"],
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

    await Queue.add(CancelDeliveryMail.key, { delivery });
    return res.json({ msg: "Problem delete" });
  }
}

export default new DeliveryProblemController();
