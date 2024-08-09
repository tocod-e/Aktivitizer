const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(403).json({fehler: true, nachricht: 'Token fehlt'})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
        if (err) return res.status(401).json({ fehler: true, nachricht: 'Ungültiges Token' })
        req.user = email;
        next();
    })
};
/*
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ fehler: true, nachricht: 'Token fehlt' });
    }

    jwt.verify(token, 'dein_geheimer_Schluessel', (err, decoded) => {
        if (err) {
            return res.status(401).json({ fehler: true, nachricht: 'Ungültiges Token' });
        }

        req.user = decoded; // Füge die decodierte Nutzerinformation zum Anfrageobjekt hinzu
        next(); // Führe die nächste Funktion in der Middleware-Kette aus
    });
};

*/

module.exports = authenticateToken;