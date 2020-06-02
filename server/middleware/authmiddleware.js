module.exports = {
  usersOnly: function(req, res, next) {
    if ((req.session.user || {}).id == null) {
      res.status(401).json({ error: "Please log in." });
    } else {
      next();
    }
  },
  adminsOnly: function(req, res, next) {
    if ((req.session.user || {}).isAdmin !== true) {
      res.status(403).json("You must be an admin to perform this action");
    } else {
      next();
    }
  },
};
