const config = require("../config");
var dbConnector = require("./dbConnect");
const { Duplex } = require("stream");
var uuid = require("uuid");
const { logger } = require("../logger");
const { auditLog, ACTIONS } = require("./audit");
const signHelper = require("./signingHelpers");
var NotifyClient = require("notifications-node-client").NotifyClient;
const { stat } = require("fs");
var utils = require("../utils");
//var notifyClient = new NotifyClient("demoapikey-0b26c96c-cc76-4151-9cf9-8b4615ecc22f-367195ba-6715-4f88-a110-c9304518b877");
//var notifyClient = new NotifyClient("test_mode_api_key-0b26c96c-cc76-4151-9cf9-8b4615ecc22f-0063fe3b-4da7-47b2-8fe5-1a811d104cd0");

const REQUEST_MORE_INFO_TEMPLATE = "353218e6-03eb-4925-b514-7907f2836611";
const NOTIFICATION_DECISON_TEMPLATE = "3d31f2b6-957d-4586-b647-34e556cc76f9";
const MULTI_NOTIFICATION_DECISION_TEMPLATE =
  "f35d43a2-b30f-4031-bbff-de75ca9fbbd2";

/*
  Handles the redirect issue whereby the session is only saved after the redirect has already happened.
*/
exports.sessionRedirect = function (next, res, req, path) {
  req.session.save(function (err) {
    if (err) return next(err);

    res.redirect(path);
  });
};

// Function to store the content of the file in the database
exports.storeFileContent = function (
  req,
  documentType,
  questionRef,
  documentName,
  documentContent,
  controlId
) {
  return new Promise(function (resolve, reject) {
    var nowDate = new Date();

    const cs = new dbConnector.pgp.helpers.ColumnSet(
      [
        "notificationreference",
        "documenttype",
        "questionref",
        "documentname",
        "documentcontent",
        "createddate",
      ],
      { table: "notificationdocuments" }
    );

    // data input values:
    const values = [
      {
        notificationreference: req.session.data.notificationReference,
        documenttype: documentType,
        questionref: questionRef,
        documentname: documentName,
        documentcontent: documentContent,
        createddate: nowDate,
      },
    ];

    // generating a multi-row insert query:
    const query = dbConnector.pgp.helpers.insert(values, cs) + "RETURNING id";

    // executing the query:
    dbConnector.dbConn
      .one(query)
      .then(function (data) {
        req.session.data[controlId] = data.id;
        resolve("success");
        logger.info({
          message: "store file content successful",
          meta: {
            action: ACTIONS.UPDATE,
            function: "storeFileContent",
            source: "NSIadmin",
            eventId: 201,
            user: req.session.authContainer.uniqueId,
            notificationid: req.session.data.notificationReference,
          },
        });
      })
      .catch(function (err) {
        reject("error");
        logger.error({
          message: "store file content error",
          err,
          meta: {
            action: ACTIONS.UPDATE,
            function: "storeFileContent",
            source: "NSIadmin",
            eventId: 201,
            user: req.session.authContainer.uniqueId,
            notificationid: req.session.data.notificationReference,
          },
        });
      });
  });
};

exports.removeItem = function (req, listKey, removeId, id) {
  let recordIndex = null;

  if (req.session.data[removeId] === "Yes") {
    for (var i = 0; i < req.session.data[listKey].length; i++) {
      if (req.session.data[listKey][i].id === req.session.data[id]) {
        recordIndex = i;

        // got the record so jump out
        break;
      }
    }

    req.session.data[listKey].splice(recordIndex, 1);
  }

  req.session.data[removeId] = "";
};

// Function to delete the uploaded notification document
exports.deleteUploadedFile = function (recordId) {
  return new Promise(function (resolve, reject) {
    // deleting rows and returning the number of rows deleted
    dbConnector.dbConn
      .result(
        "DELETE FROM notificationdocuments WHERE id = $1",
        [recordId],
        (r) => r.rowCount
      )
      .then(function (data) {
        // data --> no of rows that were deleted
        resolve("success");
        logger.info({
          message: "Delete file successful",
          meta: {
            action: ACTIONS.DELETE,
            function: "deleteUploadedFile",
            source: "NSIadmin",
            eventId: 301,
            user: "N/A",
            notificationid: "N/A",
          },
        });
      })
      .catch(function (err) {
        reject("error");
        logger.error({
          message: "Delete file error",
          err,
          meta: {
            action: ACTIONS.DELETE,
            function: "deleteUploadedFile",
            source: "NSIadmin",
            eventId: 301,
            user: "N/A",
            notificationid: "N/A",
          },
        });
      });
  });
};

/* Handles the retrieval of the notification document  */
exports.getNotificationDocument = function (recordId) {
  return new Promise(function (resolve, reject) {
    dbConnector.dbConn
      .one("SELECT * FROM notificationdocuments WHERE id = $1", [recordId])
      .then(function (data) {
        // data --> cotains the fields
        resolve({
          documentname: data.documentname,
          documentcontent: data.documentcontent,
          documenttype: data.documenttype,
        });
        logger.info({
          message: "Get Notification document successful",
          meta: {
            action: ACTIONS.READ,
            function: "getNotificationDocument",
            source: "NSIadmin",
            eventId: 401,
            user: "N/A",
            notificationid: "N/A",
          },
        });
      })
      .catch(function (err) {
        reject("error");
        logger.error({
          message: "Retrieve notification document error",
          err,
          meta: {
            action: ACTIONS.READ,
            function: "getNotificationDocument",
            source: "NSIadmin",
            eventId: 401,
            user: "N/A",
            notificationid: "N/A",
          },
        });
      });
  });
};

exports.getNotification = function (reference) {
  return new Promise(function (resolve, reject) {
    dbConnector.dbConn
      .one(
        "SELECT notificationdata, multinotifierreference, signedsubmittedpayload FROM notifications WHERE reference = $1",
        [reference]
      )
      .then(function (data) {
        resolve({ data });
        logger.info({
          message: "get notification successful",
          meta: {
            action: ACTIONS.READ,
            function: "getNotification",
            source: "NSIadmin",
            eventId: 1301,
            user: "N/A",
            notificationid: reference,
          },
        });
      })
      .catch(function (err) {
        reject("error");
        logger.error({
          message: "get notification error",
          err,
          meta: {
            action: ACTIONS.READ,
            function: "getNotification",
            source: "NSIadmin",
            eventId: 1301,
            user: "N/A",
            notificationid: reference,
          },
        });
      });
  });
};

exports.getNotifications = function () {
  return new Promise(function (resolve, reject) {
    dbConnector.dbConn
      .any("SELECT * FROM notifications WHERE status in (2, 3, 6)")
      .then(function (data) {
        resolve({ data });
        logger.info({
          message: "get notifications successful",
          meta: {
            action: ACTIONS.READ,
            function: "getNotifications",
            source: "NSIadmin",
            eventId: 1101,
            user: "N/A",
            notificationid: "N/A",
          },
        });
      })
      .catch(function (err) {
        reject("error");
        logger.error({
          message: "get notifications error",
          err,
          meta: {
            action: ACTIONS.READ,
            function: "getNotifications",
            source: "NSIadmin",
            eventId: 1101,
            user: "N/A",
            notificationid: "N/A",
          },
        });
      });
  });
};

exports.getClaimedNotifications = function (ownerId) {
  return new Promise(function (resolve, reject) {
    dbConnector.dbConn
      .any(
        "SELECT * FROM notifications WHERE ownerId = $1 AND status in (2, 3, 6)",
        ownerId
      )
      .then(function (data) {
        resolve({ data });
        logger.info({
          message: "get claimed notifications successful",
          meta: {
            action: ACTIONS.READ,
            function: "getClaimedNotifications",
            source: "NSIadmin",
            eventId: 1901,
            user: "N/A",
            notificationid: "N/A",
          },
        });
      })
      .catch(function (err) {
        logger.error({
          message: "get claimed notifications error",
          err,
          meta: {
            action: ACTIONS.READ,
            function: "getClaimedNotifications",
            source: "NSIadmin",
            eventId: 1901,
            user: "N/A",
            notificationid: "N/A",
          },
        });
        reject("error");
      });
  });
};

exports.getPendingNotifications = function () {
  return new Promise(function (resolve, reject) {
    dbConnector.dbConn
      .any("SELECT * FROM notifications WHERE status = 6")
      .then(function (data) {
        resolve({ data });
        logger.info({
          message: "get pending notifications successful",
          meta: {
            action: ACTIONS.READ,
            function: "getPendingNotifications",
            source: "NSIadmin",
            eventId: 2101,
            user: "N/A",
            notificationid: "N/A",
          },
        });
      })
      .catch(function (err) {
        logger.error({
          message: "get pending notifications error",
          err,
          meta: {
            action: ACTIONS.READ,
            function: "getPendingNotifications",
            source: "NSIadmin",
            eventId: 2101,
            user: "N/A",
            notificationid: "N/A",
          },
        });
        reject("error");
      });
  });
};

exports.getInProgressNotifications = function () {
  return new Promise(function (resolve, reject) {
    dbConnector.dbConn
      .any("SELECT * FROM notifications WHERE status = 1")
      .then(function (data) {
        resolve({ data });
        logger.info({
          message: "get in progress notifications successful",
          meta: {
            action: ACTIONS.READ,
            function: "getInProgressNotifications",
            source: "NSIadmin",
            eventId: 2001,
            user: "N/A",
            notificationid: "N/A",
          },
        });
      })
      .catch(function (err) {
        logger.error({
          message: "get in progress notifications error",
          err,
          meta: {
            action: ACTIONS.READ,
            function: "getInProgressNotifications",
            source: "NSIadmin",
            eventId: 2001,
            user: "N/A",
            notificationid: "N/A",
          },
        });
        reject("error");
      });
  });
};

exports.getRejectedNotifications = function () {
  return new Promise(function (resolve, reject) {
    dbConnector.dbConn
      .any("SELECT * FROM notifications WHERE status = 5")
      .then(function (data) {
        resolve({ data });
        logger.info({
          message: "get rejected notifications successful",
          meta: {
            action: ACTIONS.READ,
            function: "getRejectedNotifications",
            source: "NSIadmin",
            eventId: 2201,
            user: "N/A",
            notificationid: "N/A",
          },
        });
      })
      .catch(function (err) {
        logger.error({
          message: "get rejected notifications successful error",
          err,
          meta: {
            action: ACTIONS.READ,
            function: "getRejectedNotifications",
            source: "NSIadmin",
            eventId: 2201,
            user: "N/A",
            notificationid: "N/A",
          },
        });
        reject("error");
      });
  });
};

exports.getReferredNotifications = function () {
  return new Promise(function (resolve, reject) {
    dbConnector.dbConn
      .any("SELECT * FROM notifications WHERE status = 7")
      .then(function (data) {
        resolve({ data });
        logger.info({
          message: "get referred notifications successful",
          meta: {
            action: ACTIONS.READ,
            function: "getReferredNotifications",
            source: "NSIadmin",
            eventId: 2301,
            user: "N/A",
            notificationid: "N/A",
          },
        });
      })
      .catch(function (err) {
        logger.error({
          message: "get referred notifications error",
          err,
          meta: {
            action: ACTIONS.READ,
            function: "getReferredNotifications",
            source: "NSIadmin",
            eventId: 2301,
            user: "N/A",
            notificationid: "N/A",
          },
        });
        reject("error");
      });
  });
};

exports.getAcceptedNotifications = function () {
  return new Promise(function (resolve, reject) {
    dbConnector.dbConn
      .any("SELECT * FROM notifications WHERE status = 4")
      .then(function (data) {
        resolve({ data });
        logger.info({
          message: "get accepted notifications successful",
          meta: {
            action: ACTIONS.READ,
            function: "getAcceptedNotifications",
            source: "NSIadmin",
            eventId: 2305,
            user: "N/A",
            notificationid: "N/A",
          },
        });
      })
      .catch(function (err) {
        logger.error({
          message: "get accepted notifications error",
          err,
          meta: {
            action: ACTIONS.READ,
            function: "getAcceptedNotifications",
            source: "NSIadmin",
            eventId: 2305,
            user: "N/A",
            notificationid: "N/A",
          },
        });
        reject("error");
      });
  });
};

exports.updateNotes = function (req, res, next, data, reference) {
  var convData = JSON.stringify(data);
  const dataSingle = {
    notificationdata: convData,
    reference: reference,
  };

  const condition = dbConnector.pgp.as.format(
    " WHERE reference = ${reference}",
    dataSingle
  );

  var update =
    dbConnector.pgp.helpers.update(
      { notificationdata: convData },
      ["notificationdata"],
      "notifications"
    ) + condition;
  dbConnector.dbConn
    .none(update)
    .then(function () {
      req.session.save(function (err) {
        if (err) return next(err);

        res.redirect("/notes/" + reference);
      });
      logger.info({
        message: "update notes successful",
        meta: {
          action: ACTIONS.UPDATE,
          function: "updateNotes",
          source: "NSIadmin",
          eventId: 2401,
          user: req.session.authContainer.uniqueId,
          notificationid: reference,
        },
      });
    })
    .then(() => {
      auditLog(reference, req.session.authContainer.uniqueId, ACTIONS.UPDATE);
    })
    .catch(function (err) {
      logger.error({
        message: "update notes error",
        err,
        meta: {
          action: ACTIONS.UPDATE,
          function: "updateNotes",
          source: "NSIadmin",
          eventId: 2401,
          user: req.session.authContainer.uniqueId,
          notificationid: reference,
        },
      });
    });
};

exports.updateStatus = async function (
  req,
  res,
  next,
  status,
  reference,
  path
) {
  var templateId = "";
  var statusDescription = "";

  // TODO: Remove the hard-coded email address when the service is switched
  var authorisedContactEmail =
    req.session["notificationdata"].authorisedContactEmail == "" ||
    req.session["notificationdata"].authorisedContactEmail === undefined
      ? "gauravj@acubed.it"
      : req.session["notificationdata"].authorisedContactEmail;
  var authorisedContactName =
    req.session["notificationdata"].authorisedContactName;

  if (status === 4 || status === 5) {
    statusDescription = utils.status(status);
  }

  var personalisation = {
    display_name:
      authorisedContactName == "" ? "unknown" : authorisedContactName,
    notification_number: reference,
    status_description: statusDescription,
    team_name: "Investment Security Unit team",
  };

  // The email need to be sent when the case lead has requested more information
  if (status === 7) {
    // Set the template Id for request more information scenario
    templateId = REQUEST_MORE_INFO_TEMPLATE;
  }

  if (status === 4 || status === 5) {
    // Set the template Id for initial due decision made for the notification
    templateId = NOTIFICATION_DECISON_TEMPLATE;
  }

  const { data } = await this.getNotification(reference);
  const parsedData = JSON.parse(data.notificationdata);

  if (status === 4 || status === 5 || status === 7) {
    const promises = [];

    var notifyClient = new NotifyClient(
      config.properties.govukRunMode == "Live"
        ? config.properties.govukNotifyKeyLive
        : config.properties.govukNotifyKeyDemo
    );

    promises.push(
      notifyClient.sendEmail(templateId, authorisedContactEmail, {
        personalisation: personalisation,
        reference: uuid.v4(),
      })
    );

    Promise.all(promises)
      .then((results) => {
        logger.info({
          message: "Email promise success... update DB",
          meta: {
            action: ACTIONS.READ,
            function: "getNotification",
            source: "NSIadmin",
            eventId: 1301,
            user: "N/A",
            notificationid: reference,
          },
        });

        parsedData.status = status;
        var actionDate = new Date();
        var fieldArray = ["status", "notificationdata"];

        let dataSingle = {
          status: status,
          reference: reference,
        };

        if (status === 5) {
          parsedData.dateRejected = actionDate;
          fieldArray.push("daterejected");
          dataSingle.daterejected = actionDate;
        }

        if (status === 7) {
          parsedData.dateReferred = actionDate;
          fieldArray.push("datereferred");
          dataSingle.datereferred = actionDate;
        }

        if (status === 4) {
          parsedData.dateAccepted = actionDate;
          fieldArray.push("dateaccepted");
          dataSingle.dateaccepted = actionDate;
        }

        dataSingle.notificationdata = JSON.stringify(parsedData);

        const condition = dbConnector.pgp.as.format(
          " WHERE reference = ${reference}",
          dataSingle
        );

        var update =
          dbConnector.pgp.helpers.update(
            dataSingle,
            fieldArray,
            "notifications"
          ) + condition;
        dbConnector.dbConn
          .none(update)
          .then(function () {
            req.session.save(function (err) {
              if (err) return next(err);

              res.redirect(path);
            });
            logger.info({
              message: "update status successful",
              meta: {
                action: ACTIONS.UPDATE,
                function: "updateStatus",
                source: "NSIadmin",
                eventId: 2501,
                user: req.session.authContainer.uniqueId,
                notificationid: reference,
              },
            });
          })
          .then(() => {
            auditLog(
              reference,
              req.session.authContainer.uniqueId,
              ACTIONS.UPDATE
            );
          })
          .catch(function (err) {
            logger.error({
              message: "update status error",
              err,
              meta: {
                action: ACTIONS.UPDATE,
                function: "updateStatus",
                source: "NSIadmin",
                eventId: 2501,
                user: req.session.authContainer.uniqueId,
                notificationid: reference,
              },
            });
          });
      })
      .catch(function (err) {
        logger.error({
          message: "EMAIL SEND FAILURE",
          err,
          meta: {
            action: ACTIONS.UPDATE,
            function: "updateStatus",
            source: "NSIadmin",
            eventId: 2401,
            user: req.session.authContainer.uniqueId,
            notificationid: reference,
          },
        });

        console.error(err);
      });
  } else {
    // set the status
    parsedData.status = status;
    // Only perform a DB update. No email send required
    const dataSingle = {
      status: status,
      reference: reference,
      notificationdata: JSON.stringify(parsedData),
    };

    const condition = dbConnector.pgp.as.format(
      " WHERE reference = ${reference}",
      dataSingle
    );

    var update =
      dbConnector.pgp.helpers.update(
        dataSingle,
        ["status", "notificationdata"],
        "notifications"
      ) + condition;
    dbConnector.dbConn
      .none(update)
      .then(function () {
        req.session.save(function (err) {
          if (err) return next(err);

          res.redirect(path);
          logger.info({
            message: "update status successful",
            meta: {
              action: ACTIONS.UPDATE,
              function: "updateStatus",
              source: "NSIadmin",
              eventId: 2401,
              user: req.session.authContainer.uniqueId,
              notificationid: reference,
            },
          });
        });
      })
      .then(() => {
        auditLog(reference, req.session.authContainer.uniqueId, ACTIONS.UPDATE);
      })
      .catch(function (err) {
        logger.error({
          message: "update status error",
          err,
          meta: {
            action: ACTIONS.UPDATE,
            function: "updateStatus",
            source: "NSIadmin",
            eventId: 2401,
            user: req.session.authContainer.uniqueId,
            notificationid: reference,
          },
        });
      });
  }
};

exports.updateStatusWithAssignment = async function (
  req,
  res,
  next,
  status,
  reference,
  ownerId,
  ownerType,
  path
) {
  const { data } = await this.getNotification(reference);
  const parsedData = JSON.parse(data.notificationdata);

  parsedData.status = status;

  const dataSingle = {
    status: status,
    reference: reference,
    ownerid: ownerId,
    ownertype: ownerType,
    notificationdata: JSON.stringify(parsedData),
  };

  const condition = dbConnector.pgp.as.format(
    " WHERE reference = ${reference}",
    dataSingle
  );

  var update =
    dbConnector.pgp.helpers.update(
      dataSingle,
      ["status", "notificationdata", "ownerid", "ownertype"],
      "notifications"
    ) + condition;
  dbConnector.dbConn
    .none(update)
    .then(function () {
      req.session.save(function (err) {
        if (err) return next(err);

        res.redirect(path);
      });
      logger.info({
        message: "update status with assignment successful",
        meta: {
          action: ACTIONS.UPDATE,
          function: "updateStatusWithAssignment",
          source: "NSIadmin",
          eventId: 2601,
          user: req.session.authContainer.uniqueId,
          notificationid: reference,
        },
      });
    })
    .then(() => {
      auditLog(reference, req.session.authContainer.uniqueId, ACTIONS.UPDATE);
    })
    .catch(function (err) {
      logger.error({
        message: "update status with assignment error",
        err,
        meta: {
          action: ACTIONS.UPDATE,
          function: "updateStatusWithAssignment",
          source: "NSIadmin",
          eventId: 2601,
          user: req.session.authContainer.uniqueId,
          notificationid: reference,
        },
      });
    });
};

exports.updateStatusWithDecisions = async function (
  req,
  res,
  next,
  status,
  reference,
  decisionNotes,
  path
) {
  const { data } = await this.getNotification(reference);
  const parsedData = JSON.parse(data.notificationdata);

  parsedData.status = status;
  parsedData.decisionNotes = decisionNotes;

  const dataSingle = {
    status: status,
    reference: reference,
    notificationdata: JSON.stringify(parsedData),
  };

  const condition = dbConnector.pgp.as.format(
    " WHERE reference = ${reference}",
    dataSingle
  );

  var update =
    dbConnector.pgp.helpers.update(
      dataSingle,
      ["status", "notificationdata"],
      "notifications"
    ) + condition;
  dbConnector.dbConn
    .none(update)
    .then(function () {
      req.session.save(function (err) {
        if (err) return next(err);

        res.redirect(path);
      });
      logger.info({
        message: "update status with decisions successful",
        meta: {
          action: ACTIONS.UPDATE,
          function: "updateStatusWithDecisions",
          source: "NSIadmin",
          eventId: 2701,
          user: req.session.authContainer.uniqueId,
          notificationid: reference,
        },
      });
    })
    .then(() => {
      auditLog(reference, req.session.authContainer.uniqueId, ACTIONS.UPDATE);
    })
    .catch(function (err) {
      logger.error({
        message: "update status with decisions error",
        err,
        meta: {
          action: ACTIONS.UPDATE,
          function: "updateStatusWithDecisions",
          source: "NSIadmin",
          eventId: 2701,
          user: req.session.authContainer.uniqueId,
          notificationid: reference,
        },
      });
    });
};

function updateNotificationWithMultiNotifierReference(
  notificationReference,
  notificationData
) {
  return new Promise(function (resolve, reject) {
    const dataSingle = {
      notificationdata: notificationData,
      reference: notificationReference,
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
        resolve("Success");
        logger.info({
          message:
            "update notification with multi notifier reference successful",
          meta: {
            action: ACTIONS.UPDATE,
            function: "updateNotificationWithMultiNotifierReference",
            source: "NSIadmin",
            eventId: 1501,
            user: "N/A",
            notificationid: notificationReference,
          },
        });
      })
      .then(() => {
        auditLog(notificationReference, "N/A", ACTIONS.UPDATE);
      })
      .catch(function (err) {
        logger.error({
          message: "update notification with multi notifier reference error",
          err,
          meta: {
            action: ACTIONS.UPDATE,
            function: "updateNotificationWithMultiNotifierReference",
            source: "NSIadmin",
            eventId: 1501,
            user: "N/A",
            notificationid: notificationReference,
          },
        });
        reject(err);
      });
  });
}

exports.updateNotificationSaveSignature = function (
  notificationReference,
  signedPayload
) {
  return new Promise(function (resolve, reject) {
    const dataSingle = {
      signedacceptedpayload: signedPayload,
      reference: notificationReference,
    };

    const condition = dbConnector.pgp.as.format(
      " WHERE reference = ${reference}",
      dataSingle
    );

    var update =
      dbConnector.pgp.helpers.update(
        dataSingle,
        ["signedacceptedpayload"],
        "notifications"
      ) + condition;
    dbConnector.dbConn
      .none(update)
      .then(function () {
        resolve("Success");
        logger.info({
          message: "update notification with signature successful",
          meta: {
            action: ACTIONS.UPDATE,
            function: "updateNotificationSaveSignature",
            source: "NSIadmin",
            eventId: 1502,
            user: "N/A",
            notificationid: notificationReference,
          },
        });
      })
      .then(() => {
        auditLog(notificationReference, "N/A", ACTIONS.UPDATE);
      })
      .catch(function (err) {
        logger.error({
          message: "update notification with signature failed",
          err,
          meta: {
            action: ACTIONS.UPDATE,
            function: "updateNotificationSaveSignature",
            source: "NSIadmin",
            eventId: 1502,
            user: "N/A",
            notificationid: notificationReference,
          },
        });
        reject(err);
      });
  });
};

exports.updateStatusMultipleNotifications = async function (
  req,
  res,
  next,
  status,
  jointNotificationId,
  mappedNotificationData,
  path
) {
  var templateId = "";
  var multiNotifierStatus = "Inactive";
  var dateActioned = new Date();

  if (status === 4 || status === 5) {
    // Set the template Id for initial due decision made for the notification
    templateId = MULTI_NOTIFICATION_DECISION_TEMPLATE;
    const promises = [];

    for (
      var loopCounter = 0;
      loopCounter < mappedNotificationData.length;
      loopCounter++
    ) {
      // Set the correct status in the Json data block
      mappedNotificationData[loopCounter].mappedJsonData.status = status;
      if (status == 5) {
        mappedNotificationData[loopCounter].mappedJsonData.dateRejected =
          dateActioned;
      } else if (status == 4) {
        mappedNotificationData[loopCounter].mappedJsonData.dateAccepted =
          dateActioned;
      }
      // Call the database update
      var updateStatus = await updateNotificationWithMultiNotifierReference(
        mappedNotificationData[loopCounter].mappedJsonData
          .notificationReference,
        JSON.stringify(mappedNotificationData[loopCounter].mappedJsonData)
      );
    }

    // Loop through the mapped Notification array and build promise push for emails
    for (
      var loopCounter = 0;
      loopCounter < mappedNotificationData.length;
      loopCounter++
    ) {
      var authorisedContactEmail =
        mappedNotificationData[loopCounter].mappedJsonData
          .authorisedContactEmail == "" ||
        mappedNotificationData[loopCounter].mappedJsonData
          .authorisedContactEmail === undefined
          ? "gauravj@acubed.it"
          : mappedNotificationData[loopCounter].mappedJsonData
              .authorisedContactEmail;
      var authorisedContactName =
        mappedNotificationData[loopCounter].mappedJsonData
          .authorisedContactName;

      var personalisation = {
        display_name:
          authorisedContactName == "" ? "unknown" : authorisedContactName,
        notification_number: mappedNotificationData[loopCounter].reference,
        team_name: "Investment Security Unit team",
        joint_notification_number:
          mappedNotificationData[loopCounter].jointreference,
      };

      var notifyClient = new NotifyClient(
        config.properties.govukRunMode == "Live"
          ? config.properties.govukNotifyKeyLive
          : config.properties.govukNotifyKeyDemo
      );

      promises.push(
        notifyClient.sendEmail(templateId, authorisedContactEmail, {
          personalisation: personalisation,
          reference: uuid.v4(),
        })
      );
    }

    // Ensure that all the promises are fulfilled and the emails have been sent
    Promise.all(promises)
      .then((results) => {
        // Update the notifications table
        var fieldArray = ["status"];

        let dataSingle = {
          status: status,
          multinotifierreference: jointNotificationId,
        };

        if (status === 5) {
          fieldArray.push("daterejected");
          dataSingle.daterejected = dateActioned;
        }

        if (status === 4) {
          fieldArray.push("dateaccepted");
          dataSingle.dateaccepted = dateActioned;
        }

        // Conditional clause
        const condition = dbConnector.pgp.as.format(
          " WHERE multinotifierreference = ${multinotifierreference}",
          dataSingle
        );

        // Update statement
        var update =
          dbConnector.pgp.helpers.update(
            dataSingle,
            fieldArray,
            "notifications"
          ) + condition;

        // Execute the statement
        dbConnector.dbConn
          .none(update)
          .then(function () {
            // Update the multinotifierreference table
            const dataUpdate = {
              id: jointNotificationId,
              status: "InActive",
            };

            // Conditional clause
            const conditionClause = dbConnector.pgp.as.format(
              " WHERE id = ${id}",
              dataUpdate
            );

            // Update statement
            var updateStmt =
              dbConnector.pgp.helpers.update(
                dataUpdate,
                ["id", "status"],
                "multinotifierreference"
              ) + conditionClause;

            // Execute the statement
            dbConnector.dbConn
              .none(updateStmt)
              .then(function () {
                req.session.save(function (err) {
                  if (err) return next(err);

                  res.redirect(path);
                  logger.info({
                    message: "update status multipleNotifications successful",
                    meta: {
                      action: ACTIONS.UPDATE,
                      function: "updateStatusMultipleNotifications",
                      source: "NSIadmin",
                      eventId: 2801,
                      user: req.session.authContainer.uniqueId,
                      notificationid: req.session.data.notificationReference,
                    },
                  });
                });
              })
              .then(() => {
                auditLog(
                  req.session.data.notificationReference,
                  req.session.authContainer.uniqueId,
                  ACTIONS.UPDATE
                );
              })
              .catch(function (err) {
                logger.error({
                  message: "update status multipleNotifications error",
                  err,
                  meta: {
                    action: ACTIONS.UPDATE,
                    function: "updateStatusMultipleNotifications",
                    source: "NSIadmin",
                    eventId: 2801,
                    user: req.session.authContainer.uniqueId,
                    notificationid: req.session.data.notificationReference,
                  },
                });
              });
          })
          .catch(function (err) {
            console.log(
              "updateStatusMultipleNotifications: Updating notifications db: " +
                err
            );
          });
      })
      .catch(function (err) {
        console.log(
          "updateStatusMultipleNotifications: Unfulfilled Mail send promise: " +
            err
        );
      });
  }
};

/* Function to convert raw buffer into a readable stream */
exports.bufferToStream = function (rawBuffer) {
  let objDuplex = new Duplex();
  objDuplex.push(rawBuffer);
  objDuplex.push(null);
  return objDuplex;
};

/* Function to pull multiple notifier(s) */
exports.getMultiNotifierNotifications = function (multiRefId) {
  return new Promise(function (resolve, reject) {
    dbConnector.dbConn
      .any(
        "SELECT N.reference, N.notificationdata, N.notificationtype, N.multinotifierreference, N.status, N.createddate, MN.referencecode FROM notifications N JOIN multinotifierreference MN ON N.multinotifierreference = MN.id WHERE N.multinotifierreference = $1 ORDER BY N.ismasternotifier desc ",
        [multiRefId]
      )
      .then(function (dataItems) {
        resolve({ dataItems });
        logger.info({
          message: "get multiNotifier notifications successful",
          meta: {
            action: ACTIONS.READ,
            function: "getMultiNotifierNotifications",
            source: "NSIadmin",
            eventId: 2901,
            user: "N/A",
            notificationid: "N/A",
          },
        });
      })
      .catch(function (err) {
        logger.error({
          message: "get multiNotifier notifications error",
          err,
          meta: {
            action: ACTIONS.READ,
            function: "getMultiNotifierNotifications",
            source: "NSIadmin",
            eventId: 2901,
            user: "N/A",
            notificationid: "N/A",
          },
        });
        reject("error");
      });
  });
};
