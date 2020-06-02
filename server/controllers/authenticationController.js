const bcrypt = require("bcryptjs");
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
        const pepper = process.env.PEPPER || "";
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password + pepper, salt);
        const registeredUser = await db.register_user(isAdmin, username, hash);
        const user = registeredUser[0];
        req.session = req.session || {};
        req.session.user = req.session.user || {};
        req.session.user.isAdmin = user.is_admin;
        req.session.user.username = user.username;
        res.status(201).json(req.session.user);
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
  login: async (req, res) => {
    const { username, password } = req.body;
    let pepper = process.env.PEPPER || "";
    let db = req.app.get("db");
    let result = await db.get_user(username);
    let user = result[0];
    if (user) {
      //disable pepper only if explicitly set
      //note that register requires pepper to be
      //used in order for decrypting hashes to work.
      //even if you disable peppering after a user registers,
      //there is no way to recover that password
      //once the webmaster resets the pepper
      if (user.use_pepper === false) {
        pepper = "";
      }
      let isAuthenticated = await bcrypt.compare(password + pepper, user.hash);
      // let isAuthenticated = bcrypt.compareSync(password, user.hash);
      if (isAuthenticated) {
        req.session.user = {};
        req.session.user.username = user.username;
        req.session.user.isAdmin = user.is_admin;
        req.session.user.id = user.id;
        res.json(req.session.user);
      } else {
        res.status(401).json({ error: "Incorrect password" });
      }
    } else {
      res.status(401).json({ error: "User not found" });
    }

    // res.send("IT WORKS");
  },
  logout: async function(req, res) {
    req.session.destroy();
    res.sendStatus(200);
  },
};
