var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const nunjucks = require("nunjucks");
const config = require("./config.js");
const sessionInMemory = require("express-session");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");

// Local dependencies
const constantsMW = require("./middleware/constants");

// session database store handler
const pgSession = require("connect-pg-simple")(sessionInMemory);
const contentSecurityPolicy = require("helmet-csp");
const nocache = require("nocache");

var app = express();

config
  .loadConfig()
  .then(function (data) {
    const auth = require("./middleware/authmodule");
    var dbConnector = require("./localmodules/dbConnect");
    const webHelper = require("./localmodules/webHelpers");
    var indexRouter = require("./routes/index");
    /* ********************************************************************** SECURITY HEADERS */
    app.use(helmet());
    app.use(nocache());

    app.use((req, res, next) => {
      res.setHeader(
        "Permissions-Policy",
        "accelerometer=(), autoplay=(), camera=(), display-capture=(), document-domain=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(self), usb=(), web-share=(), xr-spatial-tracking=()"
      );
      next();
    });

    app.use(
      contentSecurityPolicy({
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='",
          ],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
        reportOnly: false,
      })
    );
    /* ********************************************************************** SECURITY HEADERS */

    // Set up App
    var nunjucksConfig = {
      autoescape: true,
      noCache: true,
      watch: false,
    };

    // use the file upload with limits
    app.use(
      fileUpload({
        limits: { fileSize: 5 * 1024 * 1024 },
      })
    );

    nunjucksConfig.express = app;

    var nunjucksAppEnv = nunjucks.configure(
      ["views", "node_modules/govuk-frontend/"],
      nunjucksConfig
    );

    app.set("view engine", "html");

    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(constantsMW);
    //app.use(express.static(path.join(__dirname, 'public')));
    app.use("/public", express.static(path.join(__dirname, "/public")));
    app.use("/assets", express.static(path.join(__dirname, "/assets")));

    // Session uses service name to avoid clashes with other prototypes
    const sessionName =
      "govuk-frontend-kit-" +
      Buffer.from(config.properties.serviceName, "utf8").toString("hex");

    app.use(
      sessionInMemory({
        store: new pgSession({
          pgPromise: dbConnector.dbConn,
        }),
        secret: "dsdcksdmclksdclkm4l3l4kml3k4mrlk34mrl3k4r",
        resave: false,
        cookie: {
          maxAge: 30 * 60 * 1000, // 30 minutes : 30 * 24 * 60 * 60 * 1000, // 30 days
          secret: config.properties.secureCookie,
        },
      })
    );

    app.use(auth.authenticateRequest);

    /* ********************************************************************** AUTHENTICATION */

    /* GET the logout route */
    app.get("/logout", function (req, res) {
      req.session.destroy(function () {
        console.log("user logged out.");
      });

      res.redirect(config.properties.authLogoutURL);
    });

    /* GET the logout route */
    app.get("/tokenExpired", function (req, res) {
      req.session.destroy(function () {
        console.log("user logged out.");
      });

      res.redirect("/");
    });

    app.get("/", (req, res) => {
      const authCodeUrlParameters = {
        scopes: ["user.read"],
        redirectUri: config.properties.authRedirectURL,
      };

      // get url to sign user in and consent to scopes needed for application
      auth.cca
        .getAuthCodeUrl(authCodeUrlParameters)
        .then((response) => {
          console.log("\nResponse auth code: \n:", response);
          res.redirect(response);
        })
        .catch((error) => console.log(JSON.stringify(error)));
    });

    app.get("/redirect", (req, res, next) => {
      const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: config.properties.authRedirectURL,
      };

      auth.cca
        .acquireTokenByCode(tokenRequest)
        .then((response) => {
          //console.log("\nResponse: \n:", response);
          if (req.session.data == null) {
            req.session.data = {};
          }
          req.session.authContainer = response;

          // response.account.idTokenClaims.roles
          for (
            var index = 0;
            index < response.account.idTokenClaims.roles.length;
            index++
          ) {
            if (
              response.account.idTokenClaims.roles[index] == "ISU_Case_Worker"
            ) {
              req.session.user = "case-worker";
            } else if (
              response.account.idTokenClaims.roles[index] == "Team_Lead"
            ) {
              req.session.user = "team-lead";
            }
          }

          webHelper.sessionRedirect(next, res, req, "/dashboard");
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send(error);
        });
    });
    /* ********************************************************************** AUTHENTICATION */

    //app.use(utils.autoStoreData);

    app.use("/", indexRouter);

    // Add variables that are available in all views
    app.locals.serviceName = config.properties.serviceName;

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      let formName = "";
      const forms = ["mandatory", "retrospective", "voluntary"];

      forms.forEach((form) => {
        if (req.path.includes(form)) {
          formName = form;
        }
      });

      // render the error page
      res.status(err.status || 500);
      res.render("error", { message: err.message, formName });
    });

    // Prevent search indexing
    app.use(function (req, res, next) {
      // Setting headers stops pages being indexed even if indexed pages link to them.
      res.setHeader("X-Robots-Tag", "noindex");
      next();
    });

    app.get("/robots.txt", function (req, res) {
      res.type("text/plain");
      res.send("User-agent: *\nDisallow: /");
    });
  })
  .catch(function (error) {
    console.log("Error: " + error);
  });

module.exports = app;
