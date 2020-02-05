class IndexController {
  index(req, res) {
    return res.json({ message: "Welcome" });
  }
}

export default new IndexController();
