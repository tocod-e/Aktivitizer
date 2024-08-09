const helper = require("../helper.js");

class kontaktformularDao {
  constructor(dbConnection) {
    this._conn = dbConnection;
  }

  getConnection() {
    return this._conn;
  }

  create(name = "", nachname = "", email = "", nachricht = "") {
    var sql =
      "INSERT INTO Kontaktformular (name, nachname, email, nachricht) VALUES (?,?,?,?)";
    var statement = this._conn.prepare(sql);
    var params = [name, nachname, email, nachricht];
    var result = statement.run(params);
  }

  toString() {
    console.log("kontaktformularDao [_conn=" + this._conn + "]");
  }
}

module.exports = kontaktformularDao;
