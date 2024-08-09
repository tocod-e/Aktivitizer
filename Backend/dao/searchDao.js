require("dotenv").config();
const helper = require("../helper.js");

class SearchDao {
  constructor(dbConnection) {
    this._conn = dbConnection;
  }

  async searchActivities(activity, city, date) {
    let sql =
      "SELECT id, name, city, date, duration, price, picture_url FROM activities WHERE 1 = 1";
    const params = [];

    if (activity) {
      sql += " AND name LIKE ?";
      params.push("%" + activity + "%");
    }
    if (city) {
      sql += " AND city LIKE ?";
      params.push("%" + city + "%");
    }
    if (date) {
      sql += " AND date = ?";
      params.push(date);
    }

    var statement = this._conn.prepare(sql);
    var result = statement.all(params);

    return result;
  }
}

module.exports = SearchDao;
