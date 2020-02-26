import Delivery from "../models/Delivery";

class DeliveryController {
  async index(req, res) {
    return res.json({ msg: "index" });
  }

  async store(req, res) {
    return res.json({ msg: "Store" });
  }

  async update(req, res) {
    return res.json({ msg: "update" });
  }

  async delete(req, res) {
    return res.json({ msg: "delete" });
  }
}

export default new DeliveryController();
