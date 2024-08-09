const helper = require("../helper.js");
var express = require("express");
var serviceRouter = express.Router();
var kontaktformulardao = require("../dao/kontaktformulardao.js");

console.log("- Service Kontaktformular");

serviceRouter.post("/kontaktformular", function (request, response) {
  console.log(
    "Service Kontaktformular: Client requested creation of new record"
  );

  var errorMsgs = [];
  if (helper.isUndefined(request.body.name)) errorMsgs.push("name fehlt");

  if (helper.isUndefined(request.body.nachname)) {
    errorMsgs.push("benutnachname fehlt");
  }
  if (helper.isUndefined(request.body.email)) {
    errorMsgs.push("email fehlt");
  }
  if (helper.isUndefined(request.body.nachricht)) {
    errorMsgs.push("nachricht fehlt");
  }

  if (errorMsgs.length > 0) {
    console.log("Service Benutzer: Creation not possible, data missing");
    response.status(400).json({
      fehler: true,
      nachricht:
        "Funktion nicht möglich. Fehlende Daten: " +
        helper.concatArray(errorMsgs),
    });
    return;
  }

  const kontaktformular = new kontaktformulardao(
    request.app.locals.dbConnection
  );
  try {
    var obj = kontaktformular.create(
      request.body.name,
      request.body.nachname,
      request.body.email,
      request.body.nachricht
    );
    console.log("Service kontaktformular: Record inserted");
    response.status(200).json(obj);
  } catch (ex) {
    console.error(
      "Service kontaktformular: Error creating new record. Exception occured: " +
        ex.message
    );
    response.status(400).json({ fehler: true, nachricht: ex.message });
  }
});

module.exports = serviceRouter;
