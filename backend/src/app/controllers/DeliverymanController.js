import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import FileAvatar from '../models/FileAvatar';

class DeliverymanController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliverymen = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: FileAvatar,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }
      ]
    });
    return res.json(deliverymen);
  }

  async store(req, res) {
    if (!req.file) {
      return res.status(400).json({ Error: 'You need upload the avatar' });
    }
    const { originalname: name, filename: path } = req.file;
    const Schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required()
    });

    if (!(await Schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const userExists = await Deliveryman.findOne({
      where: { email: req.body.email }
    });

    if (userExists) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    const avatarUpdate = await FileAvatar.create({
      name,
      path
    });

    const avatarId = avatarUpdate.id;

    const deliveryman = await Deliveryman.create({
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      avatar_id: avatarId
    });

    return res.json(deliveryman);
  }

  async update(req, res) {
    const { id } = +req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res
        .status(400)
        .json({ Error: 'Verify deliveryman ID and try again' });
    }

    const Schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar: Yup.number()
    });

    if (!(await Schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validation fails' });
    }

    const { email } = req.body;

    if (email && email !== deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({
        where: { email }
      });

      if (deliverymanExists) {
        return res.status(400).json({ Error: 'Deliveryman already exists' });
      }
    }

    const { name, avatar_id: avatarId } = await deliveryman.update(req.body);

    return res.json({
      id,
      name,
      email,
      avatarId
    });
  }

  async delete(req, res) {
    const deliverymanId = +req.params.id;

    const verifyDeliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!verifyDeliveryman) {
      return res
        .status(400)
        .json({ Error: 'Verify deliveryman id and try again' });
    }
    await Deliveryman.destroy({
      where: { id: deliverymanId }
    });

    return res.json({ Success: 'Deliveryman deleted' });
  }
}

export default new DeliverymanController();
