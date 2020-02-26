import FileSignature from "../models/FileSignature";

class FileSignatureController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const avatar = await FileSignature.create({
      name,
      path
    });

    return res.json(avatar);
  }
}

export default new FileSignatureController();
