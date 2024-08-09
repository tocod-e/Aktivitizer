const helper = require("../helper.js");
const KundeDao = require("../dao/kundeDao.js");
const express = require("express");
var serviceRouter = express.Router();
const authenticateToken = require("../middleware/authMiddleware.js");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

console.log("- Service Kunde");

serviceRouter.post("/kunde/eindeutig", function (request, response) {
  console.log("Service Kunde: Client requested check, if email is unique");

  var errorMsgs = [];
  if (helper.isUndefined(request.body.email)) errorMsgs.push("email fehlt");

  if (errorMsgs.length > 0) {
    console.log("Service Kunde: check not possible, data missing");
    response.status(400).json({
      fehler: true,
      nachricht:
        "Funktion nicht möglich. Fehlende Daten: " +
        helper.concatArray(errorMsgs),
    });
    return;
  }

  const kundeDao = new KundeDao(request.app.locals.dbConnection);
  try {
    var unique = kundeDao.isunique(request.body.email);
    console.log("Service Kunde: Check if unique, unique=" + unique);
    response.status(200).json({ email: request.body.email, eindeutig: unique });
  } catch (ex) {
    console.error(
      "Service Kunde: Error checking if unique. Exception occured: " +
        ex.message
    );
    response.status(400).json({ fehler: true, nachricht: ex.message });
  }
});

serviceRouter.post("/kunde/bestaetigen", function (request, response) {
  console.log("Service Kunde: Client requested check, if passwords match");

  var errorMsgs = [];
  if (helper.isUndefined(request.body.passwort))
    errorMsgs.push("passwort fehlt");
  if (helper.isUndefined(request.body.passwortConfirm))
    errorMsgs.push("passwortConfirm fehlt");

  if (errorMsgs.length > 0) {
    console.log("Service Kunde: check not possible, data missing");
    response.status(400).json({
      fehler: true,
      nachricht:
        "Funktion nicht möglich. Fehlende Daten: " +
        helper.concatArray(errorMsgs),
    });
    return;
  }

  const kundeDao = new KundeDao(request.app.locals.dbConnection);
  try {
    var confirmed = kundeDao.confirm(
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
      "Service Kunde: Error checking if pw match. Exception occured: " +
        ex.message
    );
    response.status(400).json({ fehler: true, nachricht: ex.message });
  }
});

//serviceRouter.get('/kunde/zugang', function(request, response) {
serviceRouter.post("/kunde/zugang", async function (request, response) {
  console.log("Service Kunde: Client requested check, if user has access");

  var errorMsgs = [];
  if (helper.isUndefined(request.body.email)) errorMsgs.push("email fehlt");
  if (helper.isUndefined(request.body.passwort))
    errorMsgs.push("passwort fehlt");

  if (errorMsgs.length > 0) {
    console.log("Service Kunde: check not possible, data missing");
    response.status(400).json({
      fehler: true,
      nachricht:
        "Funktion nicht möglich. Fehlende Daten: " +
        helper.concatArray(errorMsgs),
    });
    return;
  }

  const kundeDao = new KundeDao(request.app.locals.dbConnection);
  try {
    var hasaccess = await kundeDao.hasaccess(
      request.body.email,
      request.body.passwort
    );
    console.log(
      "Service Kunde: Check if user has access, hasaccess=" + hasaccess
    );
    response.status(200).json(hasaccess);
  } catch (ex) {
    console.error(
      "Service Kunde: Error checking if user has access. Exception occured: " +
        ex.message
    );
    response.status(400).json({ fehler: true, nachricht: ex.message });
  }
});

// Beispiel für eine geschützte Route in deinem Code
serviceRouter.get(
  "/kunde/profil",
  authenticateToken,
  function (request, response) {
    console.log(
      "Service Kunde: Client requested one record, email=" + request.user.email
    );

    // Hier kannst du auf `request.user` zugreifen, um den authentifizierten Benutzer zu identifizieren
    const currentUser = request.user.email;
    console.log(currentUser);
    const kundeDao = new KundeDao(request.app.locals.dbConnection);
    try {
      var obj = kundeDao.loadByEmail(currentUser);
      console.log("Service Kunde: Record loaded");
      response.status(200).json(obj);
    } catch (ex) {
      console.error(
        "Service Kunde: Error loading record by email. Exception occured: " +
          ex.message
      );
      response.status(400).json({ fehler: true, nachricht: ex.message });
    }
    // Beispielaktion: Eine geschützte Aktion ausführen, z.B. Daten des aktuellen Benutzers senden
    //response.status(200).json({ user: currentUser, nachricht: 'Geschützte Route erreicht' });
  }
);

/*token
serviceRouter.post('/token', function(request, response) {
    const refreshToken = request.body.token;
    if (refreshToken == null) return response.status(401);
    if (sessionStorage.includes(refreshToken));
});
*/
serviceRouter.post(
  "/kunde",
  [
    check("email", "Geben Sie eine gültige Email ein!").isEmail(),
    check(
      "passwort",
      "Geben Sie ein Passwort mit einer Mindestlänge von 7 ein!"
    ).isLength({ min: 7 }),
  ],
  function (request, response) {
    console.log("Service Kunde: Client requested creation of new record");

    var errorMsgs = [];
    if (helper.isUndefined(request.body.name)) errorMsgs.push("name fehlt");
    if (helper.isUndefined(request.body.email)) errorMsgs.push("email fehlt");
    if (helper.isUndefined(request.body.passwort))
      errorMsgs.push("passwort fehlt");

    if (errorMsgs.length > 0) {
      console.log("Service Kunde: Creation not possible, data missing");
      response.status(400).json({
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
    const kundeDao = new KundeDao(request.app.locals.dbConnection);
    try {
      var obj = kundeDao.create(
        request.body.name,
        request.body.email,
        request.body.passwort
      );
      console.log("Service Kunde: Record inserted");
      response.status(200).json(obj);
    } catch (ex) {
      console.error(
        "Service Kunde: Error creating new record. Exception occured: " +
          ex.message
      );
      response.status(400).json({ fehler: true, nachricht: ex.message });
    }
  }
);

serviceRouter.put("/kunde", function (request, response) {
  console.log("Service Kunde: Client requested update of existing record");

  var errorMsgs = [];
  if (helper.isUndefined(request.body.id)) errorMsgs.push("id fehlt");
  if (helper.isUndefined(request.body.name)) errorMsgs.push("name fehlt");
  if (helper.isUndefined(request.body.email)) errorMsgs.push("email fehlt");
  if (helper.isUndefined(request.body.neuespasswort))
    request.body.neuespasswort = null;

  if (errorMsgs.length > 0) {
    console.log("Service Kunde: Update not possible, data missing");
    response.status(400).json({
      fehler: true,
      nachricht:
        "Funktion nicht möglich. Fehlende Daten: " +
        helper.concatArray(errorMsgs),
    });
    return;
  }

  const kundeDao = new KundeDao(request.app.locals.dbConnection);
  try {
    var obj = kundeDao.update(
      request.body.id,
      request.body.name,
      request.body.email,
      request.body.neuespasswort
    );
    console.log("Service Kunde: Record updated, id=" + request.body.id);
    response.status(200).json(obj);
  } catch (ex) {
    console.error(
      "Service Kunde: Error updating record by id. Exception occured: " +
        ex.message
    );
    response.status(400).json({ fehler: true, nachricht: ex.message });
  }
});

serviceRouter.delete("/kunde/:id", function (request, response) {
  console.log(
    "Service Kunde: Client requested deletion of record, id=" +
      request.params.id
  );

  const kundeDao = new KundeDao(request.app.locals.dbConnection);
  try {
    var obj = kundeDao.loadById(request.params.id);
    kundeDao.delete(request.params.id);
    console.log(
      "Service Kunde: Deletion of record successfull, id=" + request.params.id
    );
    response.status(200).json({ gelöscht: true, eintrag: obj });
  } catch (ex) {
    console.error(
      "Service Kunde: Error deleting record. Exception occured: " + ex.message
    );
    response.status(400).json({ fehler: true, nachricht: ex.message });
  }
});

module.exports = serviceRouter;
