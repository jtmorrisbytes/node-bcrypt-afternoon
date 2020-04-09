const bcrypt = require("bcrypt");
module.exports = {
  register: async (req, res) => {
    const { username, password, isAdmin } = req.body;

    const db = req.app.get("db");

    let result = await db.get_user(username);

    const existingUser = result[0];
    if (existingUser) {
      res.status(409).json({ error: "username taken" });
    } else {
      try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const registeredUser = await db.register_user(isAdmin, username, hash);
        const user = registeredUser[0];
        req.session = req.session || {};
        req.session.user = req.session.user || {};
        req.session.user.isAdmin = user.is_admin;
        req.session.user.username = user.username;
        res.status(201).send();
      } catch (e) {
        console.error(e);
        try {
          await db.sql(`delete from users where username = ${username}`);
          res.sendStatus(500);
        } catch {
          res.sendStatus(500);
        }
      }
    }
  },
};
