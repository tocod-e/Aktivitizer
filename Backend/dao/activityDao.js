require("dotenv").config();
const helper = require("../helper.js");

class ActivityDao {
  constructor(dbConnection) {
    this._conn = dbConnection;
  }

  getConnection() {
    return this._conn;
  }

  loadById(id) {
    var sql = "SELECT * FROM activities WHERE id=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(id);

    if (helper.isUndefined(result))
      throw new Error("No Record found by id=" + id);

    return result;
  }

  loadAll() {
    var sql = "SELECT * FROM activities";
    var statement = this._conn.prepare(sql);
    var result = statement.all();

    if (helper.isArrayEmpty(result)) return [];

    return result;
  }

  exists(id) {
    var sql = "SELECT COUNT(id) AS cnt FROM activities WHERE id=?";
    var statement = this._conn.prepare(sql);
    var result = statement.get(id);

    return result.cnt == 1;
  }

  //! Aktivitäts erstellung ist noch nicht implementiert
  async create(organization = '', name = '',  plz = '', city = '', address = '', nr = '', duration = '', start = '', date = '', picture_url, person_amount = '', price = '', comment = '', unternehmenId) {
    var sql = 'INSERT INTO activities (organization,name,plz,city,address,nr,duration,start,date,picture_url,person_amount,price,comment,unternehmenId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    var statement = this._conn.prepare(sql);
    var params = [organization, name, plz, city, address, nr, duration, start, date, picture_url, person_amount, price, comment, unternehmenId];
    var result = statement.run(params);

    if (result.changes != 1) 
        throw new Error('Could not insert new Record. Data: ' + params);

    return this.loadById(result.lastInsertRowid);
}
  //  update
  //  ...
  //  delete
  //  ...

  toString() {
    console.log("ActivityDao [_conn=" + this._conn + "]");
  }
}

module.exports = ActivityDao;
