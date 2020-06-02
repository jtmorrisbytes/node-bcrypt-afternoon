module.exports = {
  dragonTreasure: async function(req, res) {
    let result = await req.app.get("db").get_dragon_treasure(1);
    res.json(result);
  },
  userTreasure: async function(req, res) {
    try {
      let userTreasure = await req.app
        .get("db")
        .get_user_treasure(req.session.user.id);
      res.json(userTreasure);
      console.log("server userTreasure", userTreasure);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  },
  addUserTreasure: async function(req, res) {
    const { treasureURL } = req.body;
    const { id } = req.session.user;
    const userTreasure = await req.app
      .get("db")
      .add_user_treasure([treasureURL || "", id]);
    res.status(200).send(userTreasure);
  },
  getAllTreasure: async function(req, res) {
    if ((req.session.user || {}).isAdmin == true) {
      try {
        res.json(await req.app.get("db").get_all_treasure());
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: e });
      }
    } else {
      console.error(e);
      res
        .status(403)
        .json({ error: "You must be an admin to perform this action" });
    }
  },
};
