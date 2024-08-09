/////////////////
// WebAnwendungen 2 Project
// Backend
// Main Server / Controller
// Version 4.0, 21.02.2023
// Wintersemester 2023, HS Albstadt-Sigmaringen, INF

/////////////////
// workaround / bugfix for linux systems
Object.fromEntries = (l) => l.reduce((a, [k, v]) => ({ ...a, [k]: v }), {});
/////////////////
const path = require("path");
const helper = require("./helper.js");
const fileHelper = require("./fileHelper.js");
const authenticateToken = require("./middleware/authMiddleware.js");
//const auth = require('./middleware/authMiddleware.js');
console.log("Starting server...");

try {
  const session = require("express-session"); // -D
  // connect database
  console.log("Connect database...");
  const Database = require("better-sqlite3");
  const dbOptions = { verbose: console.log };
  const dbFile = "./db/webanw2.sqlite";
  const dbConnection = new Database(dbFile, dbOptions);

  // create server
  const HTTP_PORT = 8000;
  const express = require("express");
  const fileUpload = require("express-fileupload");
  const cors = require("cors");
  const bodyParser = require("body-parser");
  const morgan = require("morgan");
  const _ = require("lodash");

  console.log("Creating and configuring Web Server...");
  const app = express();

  // provide service router with database connection / store the database connection in global server environment
  app.locals.dbConnection = dbConnection;

  console.log("Binding middleware...");
  app.use(express.static(__dirname + "/public"));
  app.use(
    fileUpload({
      createParentPath: true,
      limits: {
        fileSize: 2 * 1024 * 1024 * 1024, // limit to 2MB
      },
    })
  );
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(function (request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE"
    );
    response.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use(morgan("dev"));

  // Parse Anfragedaten als JSON -D
  app.use(express.json());

  //  Route CSS und PUBLIC
  app.use(express.static(path.join(__dirname, "../Frontend")));
  app.use(express.static(path.join(__dirname, "../Backend/public")));


  app.get("/home", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "Frontend", "HTML", "Homepage.html")
    );
  });
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'HTML', 'Homepage.html'));
  });
  app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Frontend", "HTML", "About.html"));
  });
  app.get("/aktivitaetsansicht", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "Frontend", "HTML", "Aktivitaetsansicht.html")
    );
  });
  app.get("/buchung", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "Frontend", "HTML", "Buchung.html")
    );
  });
  app.get("/kontaktformular", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "Frontend", "HTML", "Kontaktformular.html")
    );
  });
  app.get("/kontoansicht", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "Frontend", "HTML", "Kontoansicht.html")
    );
  });
  app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Frontend", "HTML", "Login.html"));
  });
  app.get("/registrierung", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "Frontend", "HTML", "Registrierung.html")
    );
  });

  // Middleware
  // Verwende die Middleware für geschützte Routen
  //app.get('/geschuetzte_route', verifyToken, (req, res) => {
  // Hier kannst du auf `req.user` zugreifen, um den authentifizierten Benutzer zu identifizieren
  //res.json({ nachricht: 'Geschützte Route' });
  //});
  //app.use('/auth', auth);

  // binding endpoints
  const TOPLEVELPATH = "/api";
  console.log("Binding enpoints, top level Path at " + TOPLEVELPATH);

  // serviceRouter links von unseren Projekt !
  serviceRouter = require("./services/kunde.js");
  app.use(TOPLEVELPATH, serviceRouter);

  serviceRouter = require("./services/unternehmen.js");
  app.use(TOPLEVELPATH, serviceRouter);

  serviceRouter = require("./services/search.js");
  app.use(TOPLEVELPATH, serviceRouter);

  serviceRouter = require("./services/kontaktformular.js");
  app.use(TOPLEVELPATH, serviceRouter);

  serviceRouter = require("./services/activity.js");
  app.use(TOPLEVELPATH, serviceRouter);

  serviceRouter = require("./services/dateiuploadeinzeln.js");
  app.use(TOPLEVELPATH, serviceRouter);

  //   send default error message if no matching endpoint found
  app.use(function (request, response) {
    console.log("Error occured, 404, resource not found");
    response
      .status(404)
      .json({ fehler: true, nachricht: "Resource nicht gefunden" });
  });

  // starting the Web Server
  console.log("\nBinding Port and starting Webserver...");

  var webServer = app.listen(HTTP_PORT, () => {
    console.log("Listening at localhost, port " + HTTP_PORT);
    console.log(
      "\nUsage: http://localhost:" +
        HTTP_PORT +
        TOPLEVELPATH +
        "/SERVICENAME/SERVICEMETHOD/...."
    );
    console.log(
      "\nVersion 4.0, 21.02.2023\nWintersemester 2023, HS Albstadt-Sigmaringen, INF"
    );
    console.log("\n\n-----------------------------------------");
    console.log("exit / stop Server by pressing 2 x CTRL-C");
    console.log("-----------------------------------------\n\n");
  });
} catch (ex) {
  console.error(ex);
}
