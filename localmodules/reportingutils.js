/* Function to calculate reporting totals */
exports.getReportTotals = function (mappedNotifications) {
  var totalInProgress = 0;
  var totalSubmitted = 0;
  var totalUnderReview = 0;
  var totalAccepted = 0;
  var totalRejected = 0;
  var totalPendingDecision = 0;
  var totalRequestForInformation = 0;
  var totalMandatory = 0;
  var totalVoluntary = 0;
  var totalRetrospective = 0;
  var percMandatory = 0;
  var percVoluntary = 0;
  var percRetrospective = 0;

  var percInProgress = 0;
  var percSubmitted = 0;
  var percUnderReview = 0;
  var percAccepted = 0;
  var percRejected = 0;
  var percPendingDecision = 0;
  var percRFI = 0;

  for (var index = 0; index < mappedNotifications.length; index++) {
    if (mappedNotifications[index].status.toLowerCase() == "in progress") {
      totalInProgress += 1;
    }
    if (mappedNotifications[index].status.toLowerCase() == "submitted") {
      totalSubmitted += 1;
    }
    if (mappedNotifications[index].status.toLowerCase() == "under review") {
      totalUnderReview += 1;
    }
    if (mappedNotifications[index].status.toLowerCase() == "accepted") {
      totalAccepted += 1;
    }
    if (mappedNotifications[index].status.toLowerCase() == "rejected") {
      totalRejected += 1;
    }
    if (
      mappedNotifications[index].status.toLowerCase() ==
      "submitted - pending decision"
    ) {
      totalPendingDecision += 1;
    }
    if (
      mappedNotifications[index].status.toLowerCase() ==
      "request for information"
    ) {
      totalRequestForInformation += 1;
    }

    if (
      mappedNotifications[index].notificationtype.toLowerCase() == "mandatory"
    ) {
      totalMandatory += 1;
    }
    if (
      mappedNotifications[index].notificationtype.toLowerCase() == "voluntary"
    ) {
      totalVoluntary += 1;
    }
    if (
      mappedNotifications[index].notificationtype.toLowerCase() ==
      "retrospective"
    ) {
      totalRetrospective += 1;
    }
  }

  // calculated stats
  var totalNType = totalMandatory + totalVoluntary + totalRetrospective;
  percMandatory = (100 * totalMandatory) / totalNType;
  percVoluntary = (100 * totalVoluntary) / totalNType;
  percRetrospective = (100 * totalRetrospective) / totalNType;

  var totalStatus =
    totalInProgress +
    totalSubmitted +
    totalUnderReview +
    totalAccepted +
    totalRejected +
    totalPendingDecision +
    totalRequestForInformation;
  percInProgress = (100 * totalInProgress) / totalStatus;
  percSubmitted = (100 * totalSubmitted) / totalStatus;
  percUnderReview = (100 * totalUnderReview) / totalStatus;
  percAccepted = (100 * totalAccepted) / totalStatus;
  percRejected = (100 * totalRejected) / totalStatus;
  percPendingDecision = (100 * totalPendingDecision) / totalStatus;
  percRFI = (100 * totalRequestForInformation) / totalStatus;

  var totals = {
    totalRecords: mappedNotifications.length,
    totalInProgress: totalInProgress,
    totalSubmitted: totalSubmitted,
    totalUnderReview: totalUnderReview,
    totalAccepted: totalAccepted,
    totalRejected: totalRejected,
    totalPendingDecision: totalPendingDecision,
    totalRequestForInformation: totalRequestForInformation,
    totalMandatory: totalMandatory,
    totalVoluntary: totalVoluntary,
    totalRetrospective: totalRetrospective,
    percentageMandatory: percMandatory,
    percentageVoluntary: percVoluntary,
    percentageRetrospective: percRetrospective,
    percentInProgress: percInProgress,
    percentageSubmitted: percSubmitted,
    percentageUnderReview: percUnderReview,
    percentageAccepted: percAccepted,
    percentageRejected: percRejected,
    percentagePendingDecision: percPendingDecision,
    percentageRequestForInformation: percRFI,
  };
  return totals;
};
