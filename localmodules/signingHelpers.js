const crypto = require("crypto");
const config = require("../config");

// Function to sign the message payload using pvt key (Node.js version)
// Params:
//      dataPayload: data payload to be signed.
//      outputEncoding: output encoding to be used.
function signMessageNodeVer(dataPayload, outputEncoding = "base64") {
  var signedData = "";
  try {
    var signer = crypto.createSign("sha256");
    signer.update(dataPayload);
    signedData = signer.sign(config.properties.privateKey, outputEncoding);
  } catch (error) {
    console.log("Error encountered creating signature:" + error);
  }
  return signedData;
}

function sanitiseObject(dataBlock) {
  var sessionDataCopy = JSON.parse(JSON.stringify(dataBlock));

  delete sessionDataCopy["status"];
  delete sessionDataCopy["notes"];
  delete sessionDataCopy["decisionNotes"];
  delete sessionDataCopy["statusMessage"];
  delete sessionDataCopy["dateReferred"];
  delete sessionDataCopy["dateRejected"];
  delete sessionDataCopy["dateAccepted"];

  return sessionDataCopy;
}

// Function to verify the message payload using public key (Node.js version)
// Params:
//      dataPayload: data payload to be verified.
//      signedPayload: signed payload against which dataPayload needs to be verified.
//      outputEncoding: output encoding to be used.
function verifyMessageNodeVer(
  dataPayload,
  signedPayload,
  specifiedEncoding = "base64"
) {
  var verificationResult = false;
  try {
    var verifier = crypto.createVerify("sha256");
    verifier.update(dataPayload);
    // Replace RSA token from the public key as Node crypto object (asn parser) doesn't recognise it
    //const modPublicKey = publicKey.replace(/RSA /g, '');
    var verificationResult = verifier.verify(
      config.properties.publicKey,
      signedPayload,
      specifiedEncoding
    );
    console.log(verificationResult);
  } catch (error) {
    console.log("Error encountered when verifying the signature:" + error);
  }
  return verificationResult;
}

module.exports = {
  signMessageNodeVer,
  verifyMessageNodeVer,
  sanitiseObject,
};
