const AddConstantsMiddleware = function (req, res, next) {
  const OPTIONS = require("../constants/options.js");
  const STRINGS = require("../constants/strings.json");
  res.locals = {
    ...res.locals,
    OPTIONS,
    STRINGS,
  };
  next();
};
module.exports = AddConstantsMiddleware;
