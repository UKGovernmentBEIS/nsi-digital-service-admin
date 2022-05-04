var moment = require("moment");

exports.ragStatus = (date) => {
  if (date == null || date == "") {
    return { state: "", elapsedDays: 0 };
  } else {
    const now = new Date();
    const elapsedTime = now - date;
    const oneWeek = 604800000;
    const fourDays = 345600000;
    const elapsedDays = Math.floor(new moment.duration(elapsedTime).asDays());

    if (elapsedTime > oneWeek) {
      return { state: "red", elapsedDays: elapsedDays };
    }

    if (elapsedTime < fourDays) {
      return { state: "green", elapsedDays: elapsedDays };
    }

    return { state: "amber", elapsedDays: elapsedDays };
  }
};

exports.acquirer = (data = {}) => {
  var acquiringPartyName = "";

  if (data.formType == "mandatory") {
    var acquirerOrRepresentative = data.q1iAcquirerOrRepresentative;

    // Populate Organisation & Contact details for the acquirer / representative organisation
    acquiringPartyName =
      acquirerOrRepresentative == "acquirer"
        ? data.q1iiAcquirerFullname
        : data.q1iiiAcquiringPartyName;
  } else if (data.formType == "retrospective") {
    var notifyingPartyOrRepresentative = data.q1iNotifyingPartyOrRepresentative;

    // Populate Organisation & Contact details for the acquirer / representative organisation
    acquiringPartyName =
      notifyingPartyOrRepresentative == "notifyingParty"
        ? data.q1iiNotifyingPartyName
        : data.q1iiiNotifyingPartyName;
  } else if (data.formType == "voluntary") {
    var notifyingPartyOrRepresentative = data.q1iNotifyingPartyOrRepresentative;

    // Populate Organisation & Contact details for the acquirer / representative organisation
    acquiringPartyName =
      notifyingPartyOrRepresentative == "notifyingParty"
        ? data.q1iiNotifyingPartyName
        : data.q1iiiNotifyingPartyName;
  }

  return {
    acquirer: acquiringPartyName,
    sortableAcquirer: acquiringPartyName
      ? acquiringPartyName.replace(/[^a-zA-Z ]/g, "").toLowerCase()
      : "",
  };
};

exports.qualifyingTargetName = (data = {}) => {
  var targetName = "";

  if (data.formType == "voluntary") {
    if (
      data.q3iiQualifyingAssetOrQualifyingEntity != null &&
      data.q3iiQualifyingAssetOrQualifyingEntity.toUpperCase() ==
        "QUALIFYINGENTITY"
    ) {
      // dealing with an entity
      targetName = data.q5iNameQualifyingEntity;
    } else {
      // dealing with an asset
      targetName = data.q5altiNameOfAsset;
    }
  } else {
    // dealing with an entity
    targetName = data.q5iNameQualifyingEntity;
  }

  return {
    target: targetName,
    sortableTarget: targetName
      ? targetName.replace(/[^a-zA-Z ]/g, "").toLowerCase()
      : "",
  };
};

exports.date = (timestamp) => {
  const date = new Date(timestamp);

  return (
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
};

exports.sortableDate = (timestamp) => {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp);

  return date.getTime();
};

exports.reverseDate = (timestamp) => {
  if (!timestamp) {
    return "";
  }

  var splitDate = timestamp.split("/");

  const date = new Date(splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0]);

  return date.getTime();
};

exports.formDate = (timeStamp) => {
  if (!timeStamp) {
    return "";
  }

  var retString = timeStamp.getFullYear() + "-";
  retString +=
    timeStamp.getMonth() + 1 < 10
      ? "0" + (timeStamp.getMonth() + 1)
      : timeStamp.getMonth() + 1;
  retString +=
    timeStamp.getDate() < 10
      ? "-0" + timeStamp.getDate()
      : "-" + timeStamp.getDate();

  return retString;
};

exports.status = (statusCode) => {
  const status = {
    1: "In Progress",
    2: "Submitted",
    3: "Under Review",
    4: "Accepted",
    5: "Rejected",
    6: "Submitted - Pending Decision",
    7: "Request for Information",
  };

  return status[String(statusCode)]
    ? status[String(statusCode)]
    : "In Progress";
};
