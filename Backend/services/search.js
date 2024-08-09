const helper = require("../helper.js");
var express = require("express");
var serviceRouter = express.Router();
const SearchDao = require("../dao/searchDao.js");

console.log("- Service Aktivität Suche");

serviceRouter.post("/search", async function (request, response) {
  console.log(
    "Service Aktivität Suche: Client requested search for activities"
  );

  var errorMsgs = [];
  if (helper.isUndefined(request.body.activity))
    errorMsgs.push("activity missing");
  if (helper.isUndefined(request.body.city)) errorMsgs.push("city missing");
  if (helper.isUndefined(request.body.date)) errorMsgs.push("date missing");

  if (errorMsgs.length > 0) {
    console.log("Service: Search not possible, data missing");
    response.status(400).json({
      fehler: true,
      nachricht:
        "Search not possible. Missing data: " + helper.concatArray(errorMsgs),
    });
    return;
  }

  const searchDao = new SearchDao(request.app.locals.dbConnection);
  try {
    const searchResults = await searchDao.searchActivities(
      request.body.activity,
      request.body.city,
      request.body.date,
    );
    console.log("Service: Search completed");
    response.status(200).json(searchResults);
  } catch (ex) {
    console.error(
      "Service: Error in search operation. Exception occurred: " + ex.message
    );
    response.status(400).json({ fehler: true, nachricht: ex.message });
  }
});

module.exports = serviceRouter;
