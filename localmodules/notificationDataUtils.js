const crypto = require("crypto");
var dbConnector = require("./dbConnect");
const { auditLog, ACTIONS } = require("./audit");
const { logger } = require("../logger");

// store the data to the database
async function createNotificationData(req, formType) {
  var nowDate = new Date();
  var notificationList = null;
  var uniqueRefFound = false;

  const cs = new dbConnector.pgp.helpers.ColumnSet(
    [
      "reference",
      "notificationdata",
      "ownerid",
      "notificationtype",
      "createddate",
      "author",
    ],
    { table: "notifications" }
  );

  req.session.data = null;
  req.session.data = {};
  var convData = JSON.stringify(req.session.data);

  // TODO: Check the uniqueness against the pre-allocated application references for other notifications.
  //while (!uniqueRefFound) {
  var appRefCodePrefix = crypto.randomBytes(16).toString("hex").substring(0, 4);
  var appRefCodeSuffix = crypto
    .randomBytes(16)
    .toString("hex")
    .substring(16, 20);
  var newRef = appRefCodePrefix + "-" + appRefCodeSuffix;

  //notificationList = await getNotificationList(newRef);
  //if (notificationList != null && notificationList.length == 0) {
  req.session.data.status = 1;
  req.session.data.notificationReference = newRef;
  req.session.data.formType = formType;
  //uniqueRefFound = true;
  //}
  //}

  // data input values:
  const values = [
    {
      reference: newRef,
      notificationdata: convData,
      ownerid: 0,
      notificationtype: formType,
      createddate: nowDate,
      status: 1,
      author: 0,
    },
  ];

  // generating a multi-row insert query:
  const query = dbConnector.pgp.helpers.insert(values, cs) + "RETURNING id";

  // executing the query:
  try {
    dbConnector.dbConn
      .one(query)
      .then(function (data) {
        req.session.data.notificationid = data.id;
        logger.info({
          message: "create Notification Data successful",
          meta: {
            action: ACTIONS.UPDATE,
            function: "createNotificationData",
            source: "NSIadmin",
            eventId: 801,
            user: req.session.authContainer.uniqueId,
            notificationid: req.session.data.notificationReference,
          },
        });
      })
      .finally(() => {
        auditLog(newRef, req.session.authContainer.uniqueId, ACTIONS.UPDATE);
      });
  } catch (error) {
    logger.error({
      message: "create Notification Data Error",
      error,
      meta: {
        action: ACTIONS.UPDATE,
        function: "createNotificationData",
        source: "NSIadmin",
        eventId: 801,
        user: req.session.authContainer.uniqueId,
        notificationid: req.session.data.notificationReference,
      },
    });
  }
}

async function updateNotificationData(req) {
  var convData = JSON.stringify(req.session.data);
  const dataSingle = {
    notificationdata: convData,
    reference: req.session.data.notificationReference,
  };

  const condition = dbConnector.pgp.as.format(
    " WHERE reference = ${reference}",
    dataSingle
  );

  var update =
    dbConnector.pgp.helpers.update(
      dataSingle,
      ["notificationdata"],
      "notifications"
    ) + condition;
  dbConnector.dbConn
    .none(update)
    .then(function () {
      auditLog(
        req.session.data.notificationReference,
        req.session.authContainer.uniqueId,
        ACTIONS.UPDATE
      );
      logger.info({
        message: "update notification data successful",
        meta: {
          action: ACTIONS.UPDATE,
          function: "updateNotificationData",
          source: "NSIadmin",
          eventId: 901,
          user: req.session.authContainer.uniqueId,
          notificationid: req.session.data.notificationReference,
        },
      });
    })
    .catch(function (err) {
      logger.error({
        message: "update notification data Error",
        err,
        meta: {
          action: ACTIONS.UPDATE,
          function: "updateNotificationData",
          source: "NSIadmin",
          eventId: 901,
          user: req.session.authContainer.uniqueId,
          notificationid: req.session.data.notificationReference,
        },
      });
    });
}

// Get a list of notifications based on the notification reference.
// Required to validate the uniqueness of the reference
async function getNotificationList(notificationRef) {
  return new Promise(function (resolve, reject) {
    var notificationsList = [];

    var sqlString =
      "select notifications.id, " +
      "notifications.reference, " +
      "notifications.createddate " +
      "from notifications where reference = '" +
      notificationRef +
      "' " +
      "order by notifications.createddate desc";

    dbConnector.dbConn
      .any(sqlString, notificationRef)
      .then(function (data) {
        for (
          var loopNotifications = 0;
          loopNotifications < data.length;
          loopNotifications++
        ) {
          var tmpDate = new Date(data[loopNotifications].createddate);

          // Create an object to save current row's data
          var notificationItem = {
            id: data[loopNotifications].id,
            reference: data[loopNotifications].reference,
            createddate:
              tmpDate.getDate() +
              "/" +
              (tmpDate.getMonth() + 1) +
              "/" +
              tmpDate.getFullYear(),
          };
          // Add object into array
          notificationsList.push(notificationItem);
        }
        resolve(notificationsList);
        logger.info({
          message: "get notification list successful",
          meta: {
            action: ACTIONS.READ,
            function: "getNotificationList",
            source: "NSIadmin",
            eventId: 1001,
            user: "N/A",
            notificationid: notificationRef,
          },
        });
      })
      .catch(function (err) {
        logger.error({
          message: "get notification list error",
          err,
          meta: {
            action: ACTIONS.READ,
            function: "getNotificationList",
            source: "NSIadmin",
            eventId: 1001,
            user: "N/A",
            notificationid: notificationRef,
          },
        });
        reject("error");
      });
  });
}

/* get the specific notification data */
async function getNotificationData(reference) {
  return new Promise(function (resolve, reject) {
    dbConnector.dbConn
      .one(
        "SELECT notificationdata, signedsubmittedpayload, signedacceptedpayload FROM notifications WHERE reference = $1",
        [reference]
      )
      .then(function (data) {
        resolve({ data });
        logger.info({
          message: "get notification data successful",
          meta: {
            action: ACTIONS.READ,
            function: "getNotificationData",
            source: "NSIadmin",
            eventId: 1701,
            user: "N/A",
            notificationid: reference,
          },
        });
      })
      .catch(function (err) {
        logger.error({
          message: "get notification data error",
          err,
          meta: {
            action: ACTIONS.READ,
            function: "getNotificationData",
            source: "NSIadmin",
            eventId: 1701,
            user: "N/A",
            notificationid: reference,
          },
        });
        reject("error");
      });
  });
}

/* get the specific notification files */
async function getNotificationFiles(reference) {
  return new Promise(function (resolve, reject) {
    dbConnector.dbConn
      .any(
        "SELECT notificationreference, questionref, documentname, documentcontent, documenttype FROM notificationdocuments WHERE notificationreference = $1",
        [reference]
      )
      .then(function (data) {
        resolve({ data });
        logger.info({
          message: "get notification files successful",
          meta: {
            action: ACTIONS.READ,
            function: "getNotificationFiles",
            source: "NSIadmin",
            eventId: 1801,
            user: "N/A",
            notificationid: reference,
          },
        });
      })
      .catch(function (err) {
        logger.error({
          message: "get notification files error",
          err,
          meta: {
            action: ACTIONS.READ,
            function: "getNotificationFiles",
            source: "NSIadmin",
            eventId: 1801,
            user: "N/A",
            notificationid: reference,
          },
        });
        reject("error");
      });
  });
}

async function advancedFilter() {
  return new Promise(function (resolve, reject) {
    dbConnector.dbConn
      .any(
        "SELECT notificationType, reference, createddate, status, notificationdata, datesubmitted, daterejected, dateaccepted, datereferred FROM notifications"
      )
      .then(function (data) {
        resolve({ data });
        logger.info({
          message: "advanced filter successful",
          meta: {
            action: ACTIONS.READ,
            function: "advancedFilter",
            source: "NSIadmin",
            eventId: 1701,
            user: "N/A",
            notificationid: "",
          },
        });
      })
      .catch(function (err) {
        logger.error({
          message: "advanced filter error",
          err,
          meta: {
            action: ACTIONS.READ,
            function: "advancedFilter",
            source: "NSIadmin",
            eventId: 1701,
            user: "N/A",
            notificationid: "",
          },
        });
        reject("error");
      });
  });
}

module.exports = {
  createNotificationData,
  updateNotificationData,
  getNotificationData,
  getNotificationFiles,
  advancedFilter,
};
