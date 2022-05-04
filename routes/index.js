var express = require("express");
var router = express.Router();
var webHelper = require("../localmodules/webHelpers");
var utils = require("../utils");
const { v4: uuidv4 } = require("uuid");
const notificationDataHelper = require("../localmodules/notificationDataUtils");
const dataTransferHelper = require("../localmodules/datatransferhelper");
const errorMessages = require("../localmodules/errormessages");
const { auditLog, ACTIONS } = require("../localmodules/audit");
const signHelper = require("../localmodules/signingHelpers");
const { logger } = require("../logger");
const reportingUtils = require("../localmodules/reportingutils");

router.get("/cleardata", function (req, res, next) {
  req.session.data = {};
  req.session.uploadValidation = null;

  res.redirect("/");
});
/*
router.get("/", function (req, res, next) {
  req.session.data = req.session.data || {};
  webHelper.sessionRedirect(next, res, req, "/dashboard");
});
*/
router.get("/user/:type", function (req, res, next) {
  const type = req.params.type;
  if (type === "team-lead") {
    req.session["user"] = "team-lead";
  }

  if (type === "case-worker") {
    req.session["user"] = "case-worker";
  }

  webHelper.sessionRedirect(next, res, req, "/dashboard");
});

router.get("/dashboard", function (req, res, next) {
  req.session.data = req.session.data || {};
  req.session.data["statusMessage"] = null;
  res.render("dashboard");
});

router.get("/notifications/:filter", async function (req, res, next) {
  const filter = req.params.filter;
  const searchTerm = req.query.search;

  const isAll = filter === "all";
  const isClaimed = filter === "claimed";
  const isPending = filter === "pending";
  const isInProgress = filter === "in-progress";
  const isRejected = filter === "rejected";
  const isReferred = filter === "referred";
  const isAccepted = filter === "accepted";

  const isTeamLead = req.session["user"] === "team-lead";
  const isCaseWorker = req.session["user"] === "case-worker";

  if (!req.session.data.decisionNotes) {
    req.session.data.decisionNotes = [];
  }

  var data = null;

  if (isAll) {
    data = await webHelper.getNotifications();
  } else if (isClaimed) {
    data = await webHelper.getClaimedNotifications(
      req.session.authContainer.uniqueId
    );
  } else if (isPending) {
    data = await webHelper.getPendingNotifications();
  } else if (isInProgress) {
    data = await webHelper.getInProgressNotifications();
  } else if (isRejected) {
    data = await webHelper.getRejectedNotifications();
  } else if (isReferred) {
    data = await webHelper.getReferredNotifications();
  } else if (isAccepted) {
    data = await webHelper.getAcceptedNotifications();
  }

  let mappedNotifications = data.data
    .sort((a, b) => a.createddate - b.createddate)
    .map((item, index) => {
      return {
        id: item.id,
        reference: item.reference,
        createddate: utils.date(data.data[index].createddate),
        sortablecreateddate: utils.sortableDate(item.createddate),
        datesubmitted:
          data.data[index].datesubmitted == null ||
          data.data[index].datesubmitted == ""
            ? ""
            : utils.date(data.data[index].datesubmitted),
        sortabledatesubmitted: utils.sortableDate(item.datesubmitted),
        notificationtype: item.notificationtype.toLowerCase(),
        jointNotificationReference:
          JSON.parse(item.notificationdata) &&
          JSON.parse(item.notificationdata).multiNotiferReference
            ? JSON.parse(item.notificationdata).multiNotiferReference
            : null,
        status: utils.status(item.status),
        ragStatus: utils.ragStatus(item.datesubmitted),
        owner: item.ownerid,
        dateReferred:
          data.data[index].datereferred == null ||
          data.data[index].datereferred == ""
            ? ""
            : utils.date(data.data[index].datereferred),
        sortabledateReferred: utils.sortableDate(item.datereferred),
        dateRejected:
          data.data[index].daterejected == null ||
          data.data[index].daterejected == ""
            ? ""
            : utils.date(data.data[index].daterejected),
        sortabledateRejected: utils.sortableDate(item.daterejected),
        dateAccepted:
          data.data[index].dateaccepted == null ||
          data.data[index].dateaccepted == ""
            ? ""
            : utils.date(data.data[index].dateaccepted),
        sortabledateAccepted: utils.sortableDate(item.dateaccepted),

        qualifyingTarget: utils.qualifyingTargetName(
          JSON.parse(item.notificationdata)
        ).target,
        sortablequalifyingTarget: utils.qualifyingTargetName(
          JSON.parse(item.notificationdata)
        ).sortableTarget,

        acquirer: utils.acquirer(JSON.parse(item.notificationdata)).acquirer,
        sortableAcquirer: utils.acquirer(JSON.parse(item.notificationdata))
          .sortableAcquirer,
        ownertype:
          !item.ownertype || item.ownertype == ""
            ? "unassigned"
            : item.ownertype,
      };
    });

  const isMatch = (field) => {
    return field && field.toLowerCase().includes(searchTerm.toLowerCase());
  };

  if (searchTerm) {
    mappedNotifications = mappedNotifications.filter(
      ({ jointNotificationReference, acquirer, status, qualifyingTarget }) =>
        isMatch(jointNotificationReference) ||
        isMatch(acquirer) ||
        isMatch(status) ||
        isMatch(qualifyingTarget)
    );
  }

  if (isReferred) {
    res.render("referredNotifications", {
      data: mappedNotifications,
      statusMessage: req.session.data["statusMessage"],
      searchTerm,
    });
  } else if (isRejected) {
    res.render("rejectedNotifications", {
      data: mappedNotifications,
      statusMessage: req.session.data["statusMessage"],
      searchTerm,
    });
  } else if (isInProgress) {
    res.render("inProgressNotifications", {
      data: mappedNotifications,
      statusMessage: req.session.data["statusMessage"],
      searchTerm,
    });
  } else if (isAccepted) {
    res.render("acceptednotifications", {
      data: mappedNotifications,
      statusMessage: req.session.data["statusMessage"],
      searchTerm,
    });
  } else {
    res.render("notifications", {
      data: mappedNotifications,
      statusMessage: req.session.data["statusMessage"],
      isClaimedView: isClaimed,
      isAllView: isAll,
      isPendingView: isPending,
      searchTerm,
    });
  }
});

router.get(
  "/notificationfilter/advancedfilter",
  async function (req, res, next) {
    var hasAcquirerName = !!req.query.acquirerName;
    var hasNotificationType = !!req.query.notificationType;
    var hasSubmissionStart = !!req.query.submissionStart;
    var hasSubmissionEnd = !!req.query.submissionEnd;
    var hasStatus = !!req.query.status;
    var hasCleared = !!req.query.cleared;
    var data = null;
    var errorMessage = "";

    var searchTerm = {
      acquirerName: hasAcquirerName === true ? req.query.acquirerName : "",
      notificationType:
        hasNotificationType === true ? req.query.notificationType : "",
      submissionStart:
        hasSubmissionStart === true ? req.query.submissionStart : "",
      submissionEnd: hasSubmissionEnd === true ? req.query.submissionEnd : "",
      status: hasStatus === true ? req.query.status : "",
    };

    if (hasSubmissionStart || hasSubmissionEnd) {
      if (hasSubmissionStart && hasSubmissionEnd) {
        // check that the start is before the end
        if (
          utils.sortableDate(searchTerm["submissionStart"]) >
          utils.sortableDate(searchTerm["submissionEnd"])
        ) {
          res.render("advancednotificationfilter", {
            statusMessage: "The End Date cannot be before the Start Date.",
          });
          return;
        }
      } else {
        // we need two dates to continue
        res.render("advancednotificationfilter", {
          statusMessage: "You must supply a date range.",
        });
        return;
      }
    }

    if (
      !hasAcquirerName &&
      !hasNotificationType &&
      !hasSubmissionStart &&
      !hasSubmissionStart &&
      !hasStatus &&
      !hasCleared
    ) {
      var nowDate = new Date();
      var backDate = new Date();

      days = 86400000; // number of milliseconds in a day
      backDate = new Date(nowDate - 7 * days);

      hasSubmissionStart = true;
      hasSubmissionEnd = true;
      searchTerm.submissionStart = utils.formDate(backDate);
      searchTerm.submissionEnd = utils.formDate(nowDate);
    } else if (hasCleared) {
      return res.render("advancednotificationfilter");
    }

    if (
      hasAcquirerName ||
      hasNotificationType ||
      hasSubmissionStart ||
      hasSubmissionStart ||
      hasStatus
    ) {
      data = await notificationDataHelper.advancedFilter();
    }

    let mappedNotifications = data.data
      .sort((a, b) => a.createddate - b.createddate)
      .map((item, index) => {
        return {
          id: item.id,
          reference: item.reference,
          createddate: utils.date(data.data[index].createddate),
          sortablecreateddate: utils.sortableDate(item.createddate),
          datesubmitted:
            data.data[index].datesubmitted == null ||
            data.data[index].datesubmitted == ""
              ? ""
              : utils.date(data.data[index].datesubmitted),
          sortabledatesubmitted: utils.sortableDate(item.datesubmitted),
          dateReferred:
            data.data[index].datereferred == null ||
            data.data[index].datereferred == ""
              ? ""
              : utils.date(data.data[index].datereferred),
          sortabledateReferred: utils.sortableDate(item.datereferred),
          dateRejected:
            data.data[index].daterejected == null ||
            data.data[index].daterejected == ""
              ? ""
              : utils.date(data.data[index].daterejected),
          sortabledateRejected: utils.sortableDate(item.daterejected),
          notificationtype: item.notificationtype.toLowerCase(),
          status: utils.status(item.status),
          dateAccepted:
            data.data[index].dateaccepted == null ||
            data.data[index].dateaccepted == ""
              ? ""
              : utils.date(data.data[index].dateaccepted),
          sortabledateAccepted: utils.sortableDate(item.dateaccepted),
          qualifyingTarget: utils.qualifyingTargetName(
            JSON.parse(item.notificationdata)
          ).target,
          sortablequalifyingTarget: utils.qualifyingTargetName(
            JSON.parse(item.notificationdata)
          ).sortableTarget,
          acquirer: utils.acquirer(JSON.parse(item.notificationdata)).acquirer,
          sortableAcquirer: utils.acquirer(JSON.parse(item.notificationdata))
            .sortableAcquirer,
          ragStatus: utils.ragStatus(item.datesubmitted),
        };
      });

    if (searchTerm) {
      mappedNotifications = mappedNotifications.filter(function ({
        acquirer,
        notificationtype,
        datesubmitted,
        status,
      }) {
        var test1 = false,
          done1 = false;
        var test2 = false,
          done2 = false;
        var test3 = false,
          done3 = false;
        var test4 = false,
          done4 = false;
        var overallTest1 = false,
          overallTest2 = false,
          overallTest3 = false,
          overallTest4 = false;

        if (hasAcquirerName) {
          done1 = true;
          if (acquirer) {
            test1 = acquirer
              .toLowerCase()
              .includes(searchTerm["acquirerName"].toLowerCase());
          }
        }

        if (hasNotificationType) {
          done2 = true;
          if (notificationtype) {
            test2 = notificationtype
              .toLowerCase()
              .includes(searchTerm["notificationType"].toLowerCase());
          }
        }

        if (hasSubmissionStart && hasSubmissionEnd) {
          done3 = true;
          if (datesubmitted) {
            var date1 = utils.reverseDate(datesubmitted);
            var dateStart = utils.sortableDate(searchTerm["submissionStart"]);
            var dateEnd = utils.sortableDate(searchTerm["submissionEnd"]);

            test3 = date1 >= dateStart && date1 <= dateEnd;
          }
        }

        if (hasStatus) {
          done4 = true;
          if (status) {
            test4 = status
              .toLowerCase()
              .includes(searchTerm["status"].toLowerCase());
          }
        }

        if (done1) {
          if (test1) {
            // worked
            overallTest1 = true;
          } else {
            // not there
            overallTest1 = false;
          }
        } else {
          overallTest1 = true;
        }

        if (done2) {
          if (test2) {
            // worked
            overallTest2 = true;
          } else {
            // not there
            overallTest2 = false;
          }
        } else {
          overallTest2 = true;
        }

        if (done3) {
          if (test3) {
            // worked
            overallTest3 = true;
          } else {
            // not there
            overallTest3 = false;
          }
        } else {
          overallTest3 = true;
        }

        if (done4) {
          if (test4) {
            // worked
            overallTest4 = true;
          } else {
            // not there
            overallTest4 = false;
          }
        } else {
          overallTest4 = true;
        }

        return overallTest1 && overallTest2 && overallTest3 && overallTest4;
      });
    }

    // get the totals
    var totals = reportingUtils.getReportTotals(mappedNotifications);

    res.render("advancednotificationfilter", {
      data: mappedNotifications,
      statusMessage: errorMessage,
      dataTotals: totals,
      searchTerm,
    });
  }
);

router.get("/notification/:reference", async function (req, res, next) {
  const reference = req.params.reference;

  const isDisableActions = !!req.query.disableActions;
  const isTeamLead = req.session["user"] === "team-lead";
  const isCaseWorker = req.session["user"] === "case-worker";

  const { data } = await webHelper.getNotification(reference);
  const notificationTemplates = {
    mandatory: "mandatoryNotification",
    retrospective: "retrospectiveNotification",
    voluntary: "voluntaryNotification",
  };
  auditLog(reference, req.session.authContainer.uniqueId, ACTIONS.READ);
  req.session.data["statusMessage"] = null;

  // Load the notification data as a JSON object
  var parsedData = JSON.parse(data.notificationdata);

  // Perform the signature verification
  var signedData = data.signedsubmittedpayload;

  // Create a copy of the session data to remove the keys not needed for signing purposes
  var sessionDataCopy = signHelper.sanitiseObject(parsedData);
  const dataBuffer = Buffer.from(JSON.stringify(sessionDataCopy));

  // Perform signature verification
  var verificationResult = signHelper.verifyMessageNodeVer(
    dataBuffer,
    signedData,
    "base64"
  );
  console.log("Verification Result:" + verificationResult);
  if (!verificationResult) {
    return next(new Error("Signature verification failed"));
  }

  // Load the data into the session
  req.session["notificationdata"] = parsedData;

  req.session.data.decisionNotes =
    parsedData.decisionNotes == null || parsedData.decisionNotes.length == 0
      ? []
      : parsedData.decisionNotes;

  const decisionNotes = req.session.data["decisionNotes"].filter(
    (item) => item.reference === reference
  );

  // Get the multi notifier data (notifications)
  var multiNotificationId = data.multinotifierreference;
  req.session["multiNotificationId"] = multiNotificationId;
  const { dataItems } = await webHelper.getMultiNotifierNotifications(
    multiNotificationId
  );

  const mappedJRN = dataItems.map((item, index) => {
    return {
      reference: item.reference,
      createddate: utils.date(item.createddate),
      status: utils.status(item.status),
      acquirer: utils.acquirer(JSON.parse(item.notificationdata)).acquirer,
      jointreference: item.referencecode,
    };
  });

  let multiNotificationData = mappedJRN;

  if (multiNotificationData.length > 0) {
    req.session["multiNotificationReference"] =
      multiNotificationData[0].jointreference;
  }
  var parsedData = JSON.parse(data.notificationdata);
  res.render(notificationTemplates[parsedData.formType.toLowerCase()], {
    data: parsedData,
    reference,
    isDisableActions,
    isTeamLead,
    isCaseWorker,
    decisionNotes: decisionNotes.length >= 1 ? decisionNotes[0] : null,
    multinotificationid: multiNotificationId,
    multiNotifierItems:
      multiNotificationId === null ||
      multiNotificationData === undefined ||
      multiNotificationData.length == 0
        ? null
        : multiNotificationData,
  });
});

router.get("/notes/:reference", async function (req, res, next) {
  const reference = req.params.reference;
  const noteId = req.query.editNote;
  let note = {};

  const { data } = await webHelper.getNotification(reference);
  const parsedData = JSON.parse(data.notificationdata);
  auditLog(reference, req.session.authContainer.uniqueId, ACTIONS.READ);

  let notes = parsedData["notes"] || [];

  if (noteId) {
    note = notes.filter((note) => note.id === noteId)[0];
    notes = notes.filter((note) => note.id !== noteId);
  }

  res.render("notes", {
    reference,
    notes: notes.filter((note) => note.notificationReference === reference),
    data: note,
  });
});

router.post("/notes/:reference", async function (req, res, next) {
  const reference = req.params.reference;
  let newNote = {};
  const isEditMode = req.body.noteId;

  const { data } = await webHelper.getNotification(reference);
  const parsedData = JSON.parse(data.notificationdata);
  auditLog(reference, req.session.authContainer.uniqueId, ACTIONS.READ);

  if (isEditMode) {
    newNote = parsedData["notes"].filter(
      (note) => note.id === req.body.noteId
    )[0];
    newNote["title"] = req.body.noteTitle;
    newNote["description"] = req.body.noteDescription;

    parsedData["notes"] = parsedData["notes"].filter(
      (note) => note.id !== req.body.noteId
    );
  } else {
    newNote = {
      id: uuidv4(),
      notificationReference: reference,
      title: req.body.noteTitle,
      description: req.body.noteDescription,
      recipient: "Notifier",
      noteOwner: req.session["user"],
      dateAdded: utils.date(Date.now()),
      isRead: false,
    };
  }

  if (parsedData["notes"] && parsedData["notes"].length >= 1) {
    parsedData["notes"].push(newNote);
  } else {
    parsedData["notes"] = [newNote];
  }

  webHelper.updateNotes(req, res, next, parsedData, reference);
});

router.get("/notes/delete/:reference/:noteId", function (req, res, next) {
  res.render("deleteNote", {
    reference: req.params.reference,
    noteId: req.params.noteId,
  });
});

router.post(
  "/notes/delete/:reference/:noteId",
  async function (req, res, next) {
    const isYes = req.body.deleteNote === "Yes";
    const reference = req.params.reference;
    const noteId = req.params.noteId;

    const { data } = await webHelper.getNotification(reference);
    const parsedData = JSON.parse(data.notificationdata);
    auditLog(reference, req.session.authContainer.uniqueId, ACTIONS.READ);

    if (isYes) {
      parsedData["notes"] = parsedData["notes"].filter(
        (note) => note.id !== noteId
      );
    }

    webHelper.updateNotes(req, res, next, parsedData, reference);
  }
);

router.get("/notes/edit/:reference/:noteId", function (req, res, next) {
  const reference = req.params.reference;
  const noteId = req.params.noteId;

  webHelper.sessionRedirect(
    next,
    res,
    req,
    "/notes/" + reference + "?editNote=" + noteId
  );
});

router.get("/reject/:reference", function (req, res, next) {
  res.render("reject", { reference: req.params.reference });
});

router.post("/reject/:reference", function (req, res, next) {
  const isYes = req.body.reject === "Yes";
  const reference = req.params.reference;

  if (isYes) {
    req.session.data["statusMessage"] =
      "Notification: " + reference + " has been successfully rejected.";
    webHelper.updateStatus(req, res, next, 5, reference, "/notifications/all");
  } else {
    webHelper.sessionRedirect(
      next,
      res,
      req,
      "/notification/" + req.params.reference
    );
  }
});

router.get("/accept/:reference", function (req, res, next) {
  res.render("accept", { reference: req.params.reference });
});

router.post("/accept/:reference", async function (req, res, next) {
  const isYes = req.body.accept === "Yes";
  const reference = req.params.reference;

  auditLog(
    req.params.reference,
    req.session.authContainer.uniqueId,
    ACTIONS.READ
  );

  if (isYes) {
    // Create signature and persist the signature
    const dataBuffer = Buffer.from(
      JSON.stringify(req.session["notificationdata"])
    );
    // sign the data (IDD) and persist the signature
    signedData = signHelper.signMessageNodeVer(dataBuffer, "base64");

    if (signedData == "") {
      return next(new Error("Error signing data payload"));
    }

    webHelper
      .updateNotificationSaveSignature(reference, signedData)
      .then(function (result) {
        // load the data
        // Get the Notification data to be submitted to CMS
        notificationDataHelper
          .getNotificationData(reference)
          .then(function (nData) {
            var originalDataPayloadString = Buffer.from(
              JSON.stringify(
                signHelper.sanitiseObject(
                  JSON.parse(nData.data.notificationdata)
                )
              )
            ).toString("base64");
            var iddPayloadString = Buffer.from(
              nData.data.notificationdata
            ).toString("base64");
            // On success, push the notification data to the module which invokes the service call
            dataTransferHelper
              .postNotification(
                originalDataPayloadString,
                iddPayloadString,
                nData.data.notificationdata,
                nData.data.signedsubmittedpayload,
                nData.data.signedacceptedpayload
              )
              .then(function (postResult) {
                // On success, get the notification docs to be uploaded
                notificationDataHelper
                  .getNotificationFiles(reference)
                  .then(function (fileList) {
                    const promises = [];

                    for (var index = 0; index < fileList.data.length; index++) {
                      // On success, invoke the promise based implementation to transfer the file
                      promises.push(
                        dataTransferHelper.postNotificationFile(
                          fileList.data[index].notificationreference,
                          dataTransferHelper.bufferToStream(
                            fileList.data[index].documentcontent
                          ),
                          fileList.data[index].documentname,
                          fileList.data[index].documenttype,
                          fileList.data[index].questionref
                        )
                      );
                    }

                    Promise.all(promises)
                      .then((results) => {
                        // all files sent
                        req.session.data["statusMessage"] =
                          "Notification: " +
                          reference +
                          " has been successfully accepted.";
                        webHelper.updateStatus(
                          req,
                          res,
                          next,
                          4,
                          reference,
                          "/notifications/all"
                        );
                      })
                      .catch(function (err) {
                        console.error(err);
                        logger.error({
                          message: "CMS file push error",
                          err,
                          meta: {
                            action: "Upload notification files on Accept",
                            function: "Accept Notification",
                            source: "NSIadmin",
                            eventId: 1801,
                            user: "N/A",
                            notificationid: reference,
                          },
                        });
                        // sending the files to the CMS
                        next(new Error(errorMessages.ERR_PUSHING_FILES));
                      });
                  })
                  .catch(function (error) {
                    // loading the files from the database
                    next(new Error(errorMessages.ERR_LOADING_FILES));
                  });
              })
              .catch(function (error) {
                // sending the notification
                next(new Error(errorMessages.ERR_PUSHING_DATA));
              });
          })
          .catch(function (error) {
            // getting the notification from the database
            next(new Error(errorMessages.ERR_LOADING_NOTIFICATION));
          });
      })
      .catch(function (error) {
        next(new Error("Error saving signature information"));
      });
  } else {
    webHelper.sessionRedirect(next, res, req, "/notification/" + reference);
  }
});

router.get("/request-more-information/:reference", function (req, res, next) {
  res.render("requestMoreInformation", { reference: req.params.reference });
});

router.post("/request-more-information/:reference", function (req, res, next) {
  const isYes = req.body.requestMoreinformation === "Yes";
  const reference = req.params.reference;

  if (isYes) {
    req.session.data["statusMessage"] =
      "More information has been requested for Notification: " + reference;
    webHelper.updateStatus(req, res, next, 7, reference, "/notifications/all");
  } else {
    webHelper.sessionRedirect(
      next,
      res,
      req,
      "/notification/" + req.params.reference
    );
  }
});

router.get("/claim-for-review/:reference", async function (req, res, next) {
  const reference = req.params.reference;

  // Load the data from the db for the specific notification
  const { data } = await webHelper.getNotification(reference);
  auditLog(reference, req.session.authContainer.uniqueId, ACTIONS.READ);

  // Load the notification data into the session
  req.session["notificationdata"] = JSON.parse(data.notificationdata);

  res.render("claimForReview", { reference: req.params.reference });
});

router.post("/claim-for-review/:reference", function (req, res, next) {
  const isYes = req.body.claimForReview === "Yes";
  const reference = req.params.reference;

  if (isYes) {
    req.session.data["statusMessage"] =
      "Notification: " + reference + " has been claimed for review";

    webHelper.updateStatusWithAssignment(
      req,
      res,
      next,
      3,
      reference,
      req.session.authContainer.uniqueId,
      req.session.user,
      "/notifications/all"
    );
  } else {
    webHelper.sessionRedirect(next, res, req, "/notifications/all");
  }
});

router.get("/decision/:reference", function (req, res, next) {
  const reference = req.params.reference;

  res.render("decision", { reference });
});

router.post("/decision/:reference", function (req, res, next) {
  const isYes = req.body.decision === "Yes";
  const reference = req.params.reference;

  if (isYes) {
    req.session.data["statusMessage"] =
      "Notification: " +
      reference +
      " has been passed to team lead for decision";

    req.session.data["decisionNotes"].push({
      reference,
      propose: req.body.propose,
      additionalInfo: req.body.additionalInfo,
    });

    webHelper.updateStatusWithDecisions(
      req,
      res,
      next,
      6,
      reference,
      req.session.data.decisionNotes,
      "/notifications/all"
    );
  } else {
    webHelper.sessionRedirect(
      next,
      res,
      req,
      "/notification/" + req.params.reference
    );
  }
});

router.get("/acceptall/:multinotificationid", function (req, res, next) {
  res.render("acceptall", {
    multinotificationid: req.params.multinotificationid,
    multinotifcationreference: req.session["multiNotificationReference"],
    notificationref: req.session["notificationdata"].notificationReference,
  });
});

router.get("/rejectall/:multinotificationid", function (req, res, next) {
  res.render("rejectall", {
    multinotificationid: req.params.multinotificationid,
    multinotifcationreference: req.session["multiNotificationReference"],
    notificationref: req.session["notificationdata"].notificationReference,
  });
});

router.post("/rejectall/:multinotificationid", async function (req, res, next) {
  const isYes = req.body.reject === "Yes";
  const multiNotificationId = req.params.multinotificationid;

  // Get a list of notifications associated with the Joint Reference id
  const { dataItems } = await webHelper.getMultiNotifierNotifications(
    multiNotificationId
  );

  const multiNotifcationReference = dataItems[0].referencecode;
  var notificationRef = dataItems[0].reference;

  if (isYes) {
    const mappedJRN = dataItems
      .filter((item) => item.status != 1)
      .map((item, index) => {
        return {
          reference: item.reference,
          createddate: utils.date(item.createddate),
          status: utils.status(item.status),
          mappedJsonData: JSON.parse(item.notificationdata),
          jointreference: item.referencecode,
        };
      });

    let multiNotificationData = mappedJRN;

    req.session.data["statusMessage"] =
      "All notifications related to the joint notification reference: " +
      multiNotifcationReference +
      " have been successfully rejected.";

    webHelper.updateStatusMultipleNotifications(
      req,
      res,
      next,
      5,
      multiNotificationId,
      multiNotificationData,
      "/notifications/all"
    );
  } else {
    webHelper.sessionRedirect(
      next,
      res,
      req,
      "/notification/" + notificationRef
    );
  }
});

router.post("/acceptall/:multinotificationid", async function (req, res, next) {
  const isYes = req.body.accept === "Yes";
  const multiNotificationId = req.params.multinotificationid;

  // Get a list of notifications associated with the Joint Reference id
  const { dataItems } = await webHelper.getMultiNotifierNotifications(
    multiNotificationId
  );

  const multiNotifcationReference = dataItems[0].referencecode;
  const notificationRef = dataItems[0].reference;

  if (isYes) {
    const mappedJRN = dataItems
      .filter((item) => item.status != 1)
      .map((item, index) => {
        return {
          reference: item.reference,
          createddate: utils.date(item.createddate),
          status: utils.status(item.status),
          mappedJsonData: JSON.parse(item.notificationdata),
          jointreference: item.referencecode,
        };
      });

    let multiNotificationData = mappedJRN;
    const promises = [];

    // Extract the master item's joint notification reference
    multiNotificationData[0].mappedJsonData.jointNotificationReference =
      multiNotificationData[0].jointreference;

    // Transfer the master item to the CMS
    dataTransferHelper
      .postNotification(multiNotificationData[0].mappedJsonData)
      .then(function (dataMessage) {
        // Get the files for the master item notification
        notificationDataHelper
          .getNotificationFiles(multiNotificationData[0].reference)
          .then(function (fileList) {
            for (var index = 0; index < fileList.data.length; index++) {
              // On success, invoke the promise based implementation to transfer the file(s) for the master item
              promiseFiles.push(
                dataTransferHelper.postNotificationFile(
                  fileList.data[index].notificationreference,
                  dataTransferHelper.bufferToStream(
                    fileList.data[index].documentcontent
                  ),
                  fileList.data[index].documentname,
                  fileList.data[index].documenttype,
                  fileList.data[index].questionref
                )
              );
            }
          })
          .catch((e) => {
            // Loading the file for each notification
            next(new Error(errorMessages.ERR_LOADING_FILES));
          });

        // Loop through the mapped Notification array and build promises for transfer of other notifications that belong to the joint notification reference
        for (
          var loopCounter = 1;
          loopCounter < multiNotificationData.length;
          loopCounter++
        ) {
          // Set the multinotification reference for each notification
          multiNotificationData[
            loopCounter
          ].mappedJsonData.jointNotificationReference =
            multiNotificationData[loopCounter].jointreference;
          promises.push(
            dataTransferHelper.postNotification(
              multiNotificationData[loopCounter].mappedJsonData
            )
          );
        }

        const promiseFiles = [];

        promises.length;

        Promise.all(promises)
          .then((results) => {
            // all other notifications sent, let's push the attachment(s) for each notification item
            for (
              var loopCounter = 1;
              loopCounter < multiNotificationData.length;
              loopCounter++
            ) {
              notificationDataHelper
                .getNotificationFiles(
                  multiNotificationData[loopCounter].reference
                )
                .then(function (fileList) {
                  for (var index = 0; index < fileList.data.length; index++) {
                    // On success, invoke the promise based implementation to transfer the file(s) for the other notification item
                    promiseFiles.push(
                      dataTransferHelper.postNotificationFile(
                        fileList.data[index].notificationreference,
                        dataTransferHelper.bufferToStream(
                          fileList.data[index].documentcontent
                        ),
                        fileList.data[index].documentname,
                        fileList.data[index].documenttype,
                        fileList.data[index].questionref
                      )
                    );
                  }
                })
                .catch((e) => {
                  // Loading the file for each notification
                  next(new Error(errorMessages.ERR_LOADING_FILES));
                });
            }

            Promise.all(promiseFiles)
              .then((results) => {
                // all files sent
                req.session.data["statusMessage"] =
                  "All notifications related to the joint notification reference: " +
                  multiNotifcationReference +
                  " have been successfully accepted.";

                webHelper.updateStatusMultipleNotifications(
                  req,
                  res,
                  next,
                  4,
                  multiNotificationId,
                  multiNotificationData,
                  "/notifications/all"
                );
              })
              .catch((e) => {
                // sending the files to the CMS
                next(new Error(errorMessages.ERR_PUSHING_FILES));
              });
          })
          .catch((e) => {
            // sending the notification(s) to the CMS
            next(new Error(errorMessages.ERR_PUSHING_DATA));
          });
      })
      .catch((e) => {
        // sending the notification(s) to the CMS
        next(new Error(errorMessages.ERR_PUSHING_DATA));
      });
  } else {
    webHelper.sessionRedirect(
      next,
      res,
      req,
      "/notification/" + notificationRef
    );
  }
});

router.get("/download-document/:id", async function (req, res, next) {
  var recordId = req.params.id;

  // Perform DB fetch
  var documentFetch = await webHelper.getNotificationDocument(recordId);

  if (documentFetch == "error") {
    return next({ message: "Error downloading the document.", status: 500 });
  }
  auditLog(recordId, req.session.authContainer.uniqueId, ACTIONS.READ);

  res.setHeader(
    "Content-disposition",
    "attachment; filename=" + documentFetch.documentname
  );
  res.setHeader("Content-type", documentFetch.documenttype);
  //var filestream = fs.createReadStream(documentFetch.documentcontent);
  var filestream = webHelper.bufferToStream(documentFetch.documentcontent);
  filestream.pipe(res);
});

module.exports = router;
