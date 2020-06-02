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
};
