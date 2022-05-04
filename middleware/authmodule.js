const msal = require("@azure/msal-node");
const config = require("../config");

const authConfig = {
  auth: {
    clientId: config.properties.authClientID,
    authority: config.properties.authAuthorityURL,
    clientSecret: config.properties.authClientSecret,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
};

// Create msal application object
cca = new msal.ConfidentialClientApplication(authConfig);

exports.authenticateRequest = async function (req, res, next) {
  if (
    req.path != "/login" &&
    req.path != "/logout" &&
    req.path != "/redirect" &&
    !req.path.startsWith("/public") &&
    !req.path.startsWith("/assets") &&
    !req.path.startsWith("/govuk") &&
    !req.path.startsWith("/favicon") &&
    req.path != "/start" &&
    !req.path.startsWith("/node_modules")
  ) {
    // expiry check
    //var utcSeconds = req.session.authContainer.idTokenClaims.exp;
    //var expiryDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
    //expiryDate.setUTCSeconds(utcSeconds);

    if (!req.session.authContainer) {
      if (req.path == "/") {
        next();
      } else {
        res.redirect("/logout");
      }
    } else {
      var expireDate = new Date(req.session.authContainer.extExpiresOn);
      expireDate.setTime(expireDate.getTime() - 300000); //60,000 ms per minute * 5 = 300,000 ms
      var nowDate = new Date();

      // are we five minutes or more away from the expiry?
      if (nowDate > expireDate) {
        // Build silent request
        const silentRequest = {
          account: req.session.authContainer,
          scopes: ["user.read"],
        };

        // Acquire Token Silently to be used in Resource API calll
        cca
          .acquireTokenSilent(silentRequest)
          .then((response) => {
            // Handle successful resource API response
            console.log("Token obtained successfully");
            req.session.authContainer = response;
            next();
          })
          .catch((error) => {
            // Handle resource API request error
            console.log("Could not obtain a new token");
            res.redirect("/logout");
          });
      } else {
        next();
      }
    }
  } else {
    next();
  }
};

exports.cca = cca;
