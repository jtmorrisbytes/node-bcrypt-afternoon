module.exports = {
  dragonTreasure: async function(req, res) {
    let result = await req.app.get("db").get_dragon_treasure(1);
    res.json(result);
  },
};
