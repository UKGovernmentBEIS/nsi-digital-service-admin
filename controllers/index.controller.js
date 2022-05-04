var webHelper = require("../localmodules/webHelpers");

/* Handles the submission of a notification */
exports.handlePost = async function (req, res, next) {
  req.session.data.status = 2;

  var data = req.session.data;

  webHelper.sessionRedirect(next, res, req, "/");
};
