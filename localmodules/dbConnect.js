const config = require("../config");
const initOptions = {
  /* initialization options */
};
const pgp = require("pg-promise")(initOptions);
const dbConn = pgp(config.properties.db);

module.exports = {
  pgp,
  dbConn,
};
