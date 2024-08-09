require("dotenv").config();
const helper = require("../helper.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class KundeDao {
  constructor(dbConnection) {
    this._conn = dbConnection;
  }

  getConnection() {
    return this._conn;
  }

  loadById(id) {
    var sql = "SELECT * FROM Kunde WHERE id=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(id);

    if (helper.isUndefined(result))
      throw new Error("No Record found by id=" + id);

    return result;
  }

  loadByEmail(email) {
    var sql = "SELECT * FROM Kunde WHERE email=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(email);

    if (helper.isUndefined(result))
      throw new Error("No Record found by email=" + email);

    return result;
  }

  loadAll() {
    var sql = "SELECT * FROM Kunde";
    var statement = this._conn.prepare(sql);
    var result = statement.all();

    if (helper.isArrayEmpty(result)) return [];

    return result;
  }

  exists(id) {
    var sql = "SELECT COUNT(id) AS cnt FROM Kunde WHERE id=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(id);

    if (result.cnt == 1) return true;

    return false;
  }

  isunique(email) {
    var sql = "SELECT COUNT(id) AS cnt FROM Kunde WHERE email=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(email);

    if (result.cnt == 0) return true;

    return false;
  }

  confirm(passwort, passwortConfirm) {
    if (passwort !== passwortConfirm)
      // Passwort stimmt nicht überein
      return false;
    return true;
  }

  async hasaccess(email, passwort) {
    var sql = "SELECT ID, passwort FROM Kunde WHERE email = ?";
    var statement = this._conn.prepare(sql);
    var result = await statement.get(email);

    if (!result) {
      throw new Error("Email not found");
    }
    try {
      if (await bcrypt.compare(passwort, result.passwort)) {
        var user = await this.loadById(result.id);

        //const secretKey = 'SECRET';
        var accessToken = await jwt.sign(
          { email: email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30min" }
        );
        //console.log(accessToken)
        var refreshToken = await jwt.sign(
          { email: email },
          process.env.REFRESH_TOKEN_SECRET
        );
        //return { accessToken: accessToken, refreshToken: refreshToken, user: user };
        return { accessToken: accessToken };
      } else {
        throw new Error("Incorrect password");
      }
    } catch {
      throw new Error("Error in verifying login: " + error.message);
    }
  }

  async create(name = "", email = "", passwort = "", rolleId = 2) {
    var sql =
      "INSERT INTO Kunde (name, email, passwort, rolleId) VALUES (?,?,?,2)";
    var statement = this._conn.prepare(sql);
    var params = [name, email, await bcrypt.hash(passwort, 8)];
    var result = statement.run(params);

    if (result.changes != 1)
      throw new Error("Could not insert new Record. Data: " + params);

    return this.loadById(result.lastInsertRowid);
  }

  update(id, name = "", email = "", neuespasswort = null) {
    if (helper.isNull(neuespasswort)) {
      var sql = "UPDATE Kunde SET name=?,email=? WHERE id=?";
      var statement = this._conn.prepare(sql);
      var params = [name, email];
    } else {
      var sql = "UPDATE Kunde SET name=?,email=?,passwort=? WHERE id=?";
      var statement = this._conn.prepare(sql);
      var params = [name, email, md5(neuespasswort)];
    }
    var result = statement.run(params);

    if (result.changes != 1)
      throw new Error("Could not update existing Record. Data: " + params);

    return this.loadById(id);
  }

  delete(id) {
    try {
      var sql = "DELETE FROM Kunde WHERE id=?";
      var statement = this._conn.prepare(sql);
      var result = statement.run(id);

      if (result.changes != 1)
        throw new Error("Could not delete Record by id=" + id);

      return true;
    } catch (ex) {
      throw new Error(
        "Could not delete Record by id=" + id + ". Reason: " + ex.message
      );
    }
  }

  toString() {
    console.log("KundeDao [_conn=" + this._conn + "]");
  }
}

module.exports = KundeDao;
