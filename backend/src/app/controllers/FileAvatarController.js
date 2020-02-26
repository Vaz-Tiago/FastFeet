import FileAvatar from "../models/FileAvatar";

class FileAvatarController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const avatar = await FileAvatar.create({
      name,
      path
    });

    return res.json(avatar);
  }
}

export default new FileAvatarController();
