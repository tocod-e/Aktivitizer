const helper = require('../helper.js');
const express = require('express');
const ActivityDao = require('../dao/activityDao.js');
var serviceRouter = express.Router();

console.log('- Service Aktivitaeten');

serviceRouter.get('/aktivitaeten/alle', function(request, response) {
    console.log('Service Aktivitaeten: Client requested all records');

    const activityDao = new ActivityDao(request.app.locals.dbConnection);
    try {
        var arr = activityDao.loadAll();
        console.log('Service Aktivitaeten: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service Land: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/aktivitaeten', function(request, response) {
    console.log('Service Aktivitaeten: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.organization)) 
        errorMsgs.push('anbieter fehlt');
    if (helper.isUndefined(request.body.name)) 
        errorMsgs.push('titel fehlt');
    if (helper.isUndefined(request.body.plz)) 
        errorMsgs.push('postleitzahl fehlt');
    if (helper.isUndefined(request.body.city)) 
        errorMsgs.push('ort fehlt');
    if (helper.isUndefined(request.body.address)) 
        errorMsgs.push('straße fehlt');
    if (helper.isUndefined(request.body.nr)) 
        errorMsgs.push('hausnummer fehlt');
    if (helper.isUndefined(request.body.duration))
        errorMsgs.push('dauer fehlt');
    if (helper.isUndefined(request.body.start)) 
        errorMsgs.push('start fehlt');
    if (helper.isUndefined(request.body.date)) 
        errorMsgs.push('datum fehlt');
    if (helper.isUndefined(request.body.picture_url)) 
        errorMsgs.push('bild fehlt');
    if (helper.isUndefined(request.body.person_amount)) 
        errorMsgs.push('anzahlP fehlt');
    if (helper.isUndefined(request.body.price)) 
        errorMsgs.push('preis fehlt');
    if (helper.isUndefined(request.body.comment)) 
        errorMsgs.push('beschreibung fehlt');
    if (helper.isUndefined(request.body.unternehmen)) {
        request.body.unternehmen = null;
    } else if (helper.isUndefined(request.body.unternehmen.id)) {
        errorMsgs.push('unternehmen gesetzt, aber id fehlt');
    } else {
        request.body.unternehmen = request.body.unternehmen.id;
    }
    
    if (errorMsgs.length > 0) {
        console.log('Service Aktivitaeten: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const activityDao = new ActivityDao(request.app.locals.dbConnection);
    try {
        var obj = activityDao.create(request.body.organization, request.body.name, request.body.plz, request.body.city, request.body.address, request.body.nr, request.body.duration, request.body.start, request.body.date, request.body.picture_url, request.body.person_amount, request.body.price, request.body.comment, request.body.unternehmenId);
        console.log('Service Aktivitaeten: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Aktivitaeten: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;