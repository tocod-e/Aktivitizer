const helper = require("../helper.js");
const UnternehmenDao = require("../dao/unternehmenDao.js");
const express = require("express");
var serviceRouter = express.Router();
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware.js");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

console.log("- Service Unternehmen");

serviceRouter.post("/unternehmen/eindeutig", function (request, response) {
  console.log(
    "Service Unternehmen: Client requested check, if email is unique"
  );

  var errorMsgs = [];
  if (helper.isUndefined(request.body.email)) errorMsgs.push("email fehlt");

  if (errorMsgs.length > 0) {
    console.log("Service Unternehmen: check not possible, data missing");
    response
      .status(400)
      .json({
        fehler: true,
        nachricht:
          "Funktion nicht möglich. Fehlende Daten: " +
          helper.concatArray(errorMsgs),
      });
    return;
  }

  const unternehmenDao = new UnternehmenDao(request.app.locals.dbConnection);
  try {
    var unique = unternehmenDao.isunique(request.body.email);
    console.log("Service Unternehmen: Check if unique, unique=" + unique);
    response.status(200).json({ email: request.body.email, eindeutig: unique });
  } catch (ex) {
    console.error(
      "Service Unternehmen: Error checking if unique. Exception occured: " +
        ex.message
    );
    response.status(400).json({ fehler: true, nachricht: ex.message });
  }
});

serviceRouter.post("/unternehmen/bestaetigen", function (request, response) {
  console.log(
    "Service Unternehmen: Client requested check, if passwords match"
  );

  var errorMsgs = [];
  if (helper.isUndefined(request.body.passwort))
    errorMsgs.push("passwort fehlt");
  if (helper.isUndefined(request.body.passwortConfirm))
    errorMsgs.push("passwortConfirm fehlt");

  if (errorMsgs.length > 0) {
    console.log("Service Unternehmen: check not possible, data missing");
    response
      .status(400)
      .json({
        fehler: true,
        nachricht:
          "Funktion nicht möglich. Fehlende Daten: " +
          helper.concatArray(errorMsgs),
      });
    return;
  }

  const unternehmenDao = new UnternehmenDao(request.app.locals.dbConnection);
  try {
    var confirmed = unternehmenDao.confirm(
      request.body.passwort,
      request.body.passwortConfirm
    );
    console.log("Service Kunde: Check if pw match, match=" + confirmed);
    if (confirmed) {
      response.status(200).json({ bestaetigen: true });
    } else {
      response.status(200).json({ bestaetigen: false });
    }
  } catch (ex) {
    console.error(
      "Service Unternehmen: Error checking if pw match. Exception occured: " +
        ex.message
    );
    response.status(400).json({ fehler: true, nachricht: ex.message });
  }
});

serviceRouter.post("/unternehmen/zugang", async function (request, response) {
  console.log(
    "Service Unternehmen: Client requested check, if user has access"
  );

  var errorMsgs = [];
  if (helper.isUndefined(request.body.email)) errorMsgs.push("email fehlt");
  if (helper.isUndefined(request.body.passwort))
    errorMsgs.push("passwort fehlt");

  if (errorMsgs.length > 0) {
    console.log("Service Unternehmen: check not possible, data missing");
    response
      .status(400)
      .json({
        fehler: true,
        nachricht:
          "Funktion nicht möglich. Fehlende Daten: " +
          helper.concatArray(errorMsgs),
      });
    return;
  }

  const unternehmenDao = new UnternehmenDao(request.app.locals.dbConnection);
  try {
    var hasaccess = await unternehmenDao.hasaccess(
      request.body.email,
      request.body.passwort
    );
    console.log(
      "Service Unternehmen: Check if user has access, hasaccess=" + hasaccess
    );
    response.status(200).json(hasaccess);
  } catch (ex) {
    console.error(
      "Service Unternehmen: Error checking if user has access. Exception occured: " +
        ex.message
    );
    response.status(400).json({ fehler: true, nachricht: ex.message });
  }
});

// Userdaten abrufen
serviceRouter.get(
  "/unternehmen/profil",
  authenticateToken,
  function (request, response) {
    console.log(
      "Service Unternehmen: Client requested one record, email=" +
        request.user.email
    );

    // Hier kannst du auf `request.user` zugreifen, um den authentifizierten Benutzer zu identifizieren
    const currentUser = request.user.email;
    console.log(currentUser);
    const unternehmenDao = new UnternehmenDao(request.app.locals.dbConnection);
    try {
      var obj = unternehmenDao.loadByEmail(currentUser);
      console.log("Service Unternehmen: Record loaded");
      response.status(200).json(obj);
    } catch (ex) {
      console.error(
        "Service Unternehmen: Error loading record by email. Exception occured: " +
          ex.message
      );
      response.status(400).json({ fehler: true, nachricht: ex.message });
    }
    // Beispielaktion: Eine geschützte Aktion ausführen, z.B. Daten des aktuellen Benutzers senden
    //response.status(200).json({ user: currentUser, nachricht: 'Geschützte Route erreicht' });
  }
);

serviceRouter.post(
  "/unternehmen",
  [
    check("email", "Geben Sie eine gültige Email ein!").isEmail(),
    check(
      "passwort",
      "Geben Sie ein Passwort mit einer Mindestlänge von 7 ein!"
    ).isLength({ min: 7 }),
  ],
  function (request, response) {
    console.log("Service Kunde: Client requested creation of new record");
    //name = '', telefonnummer = '', adresseId = 1, email = '', passwort = '
    var errorMsgs = [];
    if (helper.isUndefined(request.body.name)) errorMsgs.push("name fehlt");
    if (helper.isUndefined(request.body.telefonnummer))
      errorMsgs.push("telefonnummer fehlt");
    if (helper.isUndefined(request.body.land)) errorMsgs.push("land fehlt");
    if (helper.isUndefined(request.body.postleitzahl))
      errorMsgs.push("postleitzahl fehlt");
    if (helper.isUndefined(request.body.ort)) errorMsgs.push("ort fehlt");
    if (helper.isUndefined(request.body.straße)) errorMsgs.push("straße fehlt");
    if (helper.isUndefined(request.body.hausnr))
      errorMsgs.push("hausnummer fehlt");
    if (helper.isUndefined(request.body.email)) errorMsgs.push("email fehlt");
    if (helper.isUndefined(request.body.passwort))
      errorMsgs.push("passwort fehlt");

    if (errorMsgs.length > 0) {
      console.log("Service Unternehmen: Creation not possible, data missing");
      response
        .status(400)
        .json({
          fehler: true,
          nachricht:
            "Funktion nicht möglich. Fehlende Daten: " +
            helper.concatArray(errorMsgs),
        });
      return;
    }

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const unternehmenDao = new UnternehmenDao(request.app.locals.dbConnection);
    try {
      var obj = unternehmenDao.create(
        request.body.name,
        request.body.telefonnummer,
        request.body.land,
        request.body.postleitzahl,
        request.body.ort,
        request.body.straße,
        request.body.hausnr,
        request.body.email,
        request.body.passwort
      );
      console.log("Service Unternehmen: Record inserted");
      response.status(200).json(obj);
    } catch (ex) {
      console.error(
        "Service Unternehmen: Error creating new record. Exception occured: " +
          ex.message
      );
      response.status(400).json({ fehler: true, nachricht: ex.message });
    }
  }
);

serviceRouter.put("/unternehmen", function (request, response) {
  console.log(
    "Service Unternehmen: Client requested update of existing record"
  );

  var errorMsgs = [];
  if (helper.isUndefined(request.body.id)) errorMsgs.push("id fehlt");
  if (helper.isUndefined(request.body.name)) errorMsgs.push("name fehlt");
  if (helper.isUndefined(request.body.telefonnummer))
    errorMsgs.push("telefonnummer fehlt");
  if (helper.isUndefined(request.body.land)) errorMsgs.push("land fehlt");
  if (helper.isUndefined(request.body.postleitzahl))
    errorMsgs.push("postleitzahl fehlt");
  if (helper.isUndefined(request.body.ort)) errorMsgs.push("ort fehlt");
  if (helper.isUndefined(request.body.straße)) errorMsgs.push("straße fehlt");
  if (helper.isUndefined(request.body.hausnr))
    errorMsgs.push("hausnummer fehlt");
  if (helper.isUndefined(request.body.email)) errorMsgs.push("email fehlt");
  if (helper.isUndefined(request.body.neuespasswort))
    request.body.neuespasswort = null;

  if (errorMsgs.length > 0) {
    console.log("Service Unternehmen: Update not possible, data missing");
    response
      .status(400)
      .json({
        fehler: true,
        nachricht:
          "Funktion nicht möglich. Fehlende Daten: " +
          helper.concatArray(errorMsgs),
      });
    return;
  }

  const unternehmenDao = new UnternehmenDao(request.app.locals.dbConnection);
  try {
    var obj = unternehmenDao.create(
      request.body.name,
      request.body.telefonnummer,
      request.body.land,
      request.body.postleitzahl,
      request.body.ort,
      request.body.straße,
      request.body.hausnr,
      request.body.email,
      request.body.passwort
    );
    console.log("Service Unternehmen: Record updated, id=" + request.body.id);
    response.status(200).json(obj);
  } catch (ex) {
    console.error(
      "Service Unternehmen: Error updating record by id. Exception occured: " +
        ex.message
    );
    response.status(400).json({ fehler: true, nachricht: ex.message });
  }
});

serviceRouter.delete("/unternehmen/:id", function (request, response) {
  console.log(
    "Service Unternehmen: Client requested deletion of record, id=" +
      request.params.id
  );

  const unternehmenDao = new UnternehmenDao(request.app.locals.dbConnection);
  try {
    var obj = unternehmenDao.loadById(request.params.id);
    unternehmenDao.delete(request.params.id);
    console.log(
      "Service Unternehmen: Deletion of record successfull, id=" +
        request.params.id
    );
    response.status(200).json({ gelöscht: true, eintrag: obj });
  } catch (ex) {
    console.error(
      "Service Unternehmen: Error deleting record. Exception occured: " +
        ex.message
    );
    response.status(400).json({ fehler: true, nachricht: ex.message });
  }
});

module.exports = serviceRouter;
