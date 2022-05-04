const axios = require("axios");
const formData = require("form-data");
const config = require("../config");
const { Duplex } = require("stream");
var notificationPostURL = "";
var notificationFilePostURL = "";

function initUrl() {
  notificationPostURL = config.properties.notificationDataServiceURL;
  notificationFilePostURL = config.properties.notificationDocsServiceURL;
}

/**
 * Post notification data
 * @param {string} dataPayload Stringified JSON payload
 */
exports.postNotification = function (
  originalDataPayloadString,
  iddPayloadString,
  dataPayload,
  signedSubmittedPayload,
  signedAcceptedPayload
) {
  return new Promise(function (resolve, reject) {
    initUrl();
    var submitData = {
      originalDataPayloadString: originalDataPayloadString,
      iddPayloadString: iddPayloadString,
      dataPayload: dataPayload,
      signedSubmittedPayload: signedSubmittedPayload,
      signedAcceptedPayload: signedAcceptedPayload,
    };
    axios
      .post(notificationPostURL, submitData, {
        headers: { "Content-Type": "application/json" },
      })
      .then(function (response) {
        console.log(response);

        if (response.status == 200) {
          resolve("success");
        } else {
          reject("failed");
        }
      })
      .catch(function (error) {
        console.log(error);

        reject("error");
      });
  });
};

/* post notification file */
/**
 * Post notification file
 * @param {string} notificationReference Notification reference to attach file to
 * @param {blob} dataPayloadBlob File blob
 * @param {string} fileName File name
 * @param {string} mimeType MIME type definition
 * @param {string} subject Uploaded file subject
 */
exports.postNotificationFile = function (
  notificationReference,
  dataPayloadBlob,
  fileName,
  mimeType,
  subject
) {
  return new Promise(function (resolve, reject) {
    initUrl();
    const fData = new formData();

    fData.append(
      "jsonData",
      '{ "filename":"' +
        fileName +
        '", "notificationReference":"' +
        notificationReference +
        '", "mimetype":"' +
        mimeType +
        '", "subject": "' +
        subject +
        '" }'
    );
    fData.append("image", dataPayloadBlob, fileName);

    axios
      .post(notificationFilePostURL, fData, {
        // You need to use `getHeaders()` in Node.js because Axios doesn't
        // automatically set the multipart form boundary in Node.
        headers: fData.getHeaders(),
      })
      .then(function (response) {
        console.log(response);

        if (response.status == 200) {
          resolve("success");
        } else {
          reject("failed");
        }
      })
      .catch(function (error) {
        console.log(error);

        reject("error");
      });
  });
};

/**
 * Function to convert raw buffer into a readable stream
 * @param {buffer} rawBuffer Raw buffer to be converted
 */
exports.bufferToStream = function (rawBuffer) {
  let objDuplex = new Duplex();
  objDuplex.push(rawBuffer);
  objDuplex.push(null);
  return objDuplex;
};
