module.exports = {
  usersOnly: function(req, res, next) {
    if ((req.session.user || {}).id == null) {
      res.status(401).json({ error: "Please log in." });
    } else {
      next();
    }
  },
};
