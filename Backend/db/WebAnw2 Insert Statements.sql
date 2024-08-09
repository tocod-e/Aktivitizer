-- ------------------------------
-- DB Modell zu WebAnwendungen 2, Version 3.0
-- Insert Statements

-- ------------------------------
-- Test
INSERT INTO Kunde (name, email, passwort) VALUES ('Daniel', 'test@test.com', '123456');

-- Rolle
INSERT INTO Rolle (bezeichnung) VALUES ('Administrator');
INSERT INTO Rolle (bezeichnung) VALUES ('Kunde');
INSERT INTO Rolle (bezeichnung) VALUES ('Unternehmen');

-- Aktivitäten
INSERT INTO activities (name, city, address, duration, date, picture_url, person_amount, price) VALUES ("TEST 1", "TEST 1","TEST STRAßE 20", "1 hours", "10.10.2023", "/homepage/example.png", 2, 2.50 );
INSERT INTO activities (name, city, address, duration, date, picture_url, person_amount, price) VALUES ("TEST 1", "TEST 1","TEST STRAßE 20", "1 hours", "10.10.2023", "/homepage/example.png", 2, 2.50 );
INSERT INTO activities (name, city, address, duration, date, picture_url, person_amount, price) VALUES ("TEST 1", "TEST 1","TEST STRAßE 20", "1 hours", "10.10.2023", "/homepage/example.png", 2, 2.50 );