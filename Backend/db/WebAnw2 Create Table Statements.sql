-- ------------------------------
-- DB Modell zu WebAnwendungen 2, Version 3.0
-- Create Table Statements

-- ------------------------------
-- eigene Tables

CREATE TABLE Rolle (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	bezeichnung TEXT NOT NULL
);

-- Unternehmen
CREATE TABLE Unternehmen (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	telefonnummer TEXT NOT NULL,
	land TEXT NOT NULL,
	postleitzahl TEXT NOT NULL,
	ort TEXT NOT NULL,
	straße TEXT NOT NULL,
	hausnr INTEGER NOT NULL,
	email TEXT NOT NULL,
	passwort TEXT NOT NULL,
	rolleId INTEGER NOT NULL,
	CONSTRAINT fk_Unternehmen1 FOREIGN KEY (rolleId) REFERENCES Rolle(id)
);

CREATE Table Kunde (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	passwort TEXT NOT NULL,
	rolleId INTEGER NOT NULL,
	CONSTRAINT fk_Kunde1 FOREIGN KEY (rolleId) REFERENCES Rolle(id)
);


DROP TABLE IF EXISTS Unternehmen;
DELETE FROM Unternehmen WHERE id=4;

-- Aktivitäten

CREATE TABLE activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
	organization TEXT NOT NULL,
    name TEXT NOT NULL,
	plz TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
	nr TEXT NOT NULL,
    duration REAL NOT NULL,
	start INTEGER NOT NULL,
    date REAL NOT NULL,
    picture_url TEXT, 
    person_amount INTEGER NOT NULL,
    price REAL NOT NULL,
	comment TEXT NOT NULL,
	unternehmenId INTEGER DEFAULT NULL,
	CONSTRAINT fk_activities1 FOREIGN KEY (unternehmenId) REFERENCES Unternehmen(id)
);


CREATE TABLE zahlungsmittel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
	karteninhaber TEXT NOT NULL,
    kartennummer TEXT NOT NULL,
	ablaufdatum TEXT NOT NULL,
    cvv INTEGER NOT NULL,
	kundenId INTEGER DEFAULT NULL,
	CONSTRAINT fk_zahlungsmittel1 FOREIGN KEY (kundenId) REFERENCES Kunde(id)
);

CREATE Table Kontaktformular(
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	nachname TEXT NOT NULL,
	email TEXT NOT NULL,
	nachricht TEXT NOT NULL
);

DROP TABLE IF EXISTS activities;