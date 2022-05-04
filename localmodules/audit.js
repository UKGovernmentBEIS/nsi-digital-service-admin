const dbConnector = require("./dbConnect");

const ACTIONS = {
  UPDATE: "UPDATE",
  READ: "READ",
  DELETE: "DELETE",
};

const auditLog = (notificationreference, userid, action) => {
  dbConnector.dbConn
    .one(
      "INSERT INTO auditdata(notificationreference, userid, action) VALUES($1, $2, $3) RETURNING id",
      [notificationreference, userid, action]
    )
    .then((data) => {
      console.log("audit data success", data);
    })
    .catch((err) => {
      console.log("audit data fail", err);
    });
};

module.exports = {
  auditLog,
  ACTIONS,
};
