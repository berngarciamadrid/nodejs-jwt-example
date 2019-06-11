const express = require('express');

const jwt = require('jsonwebtoken');

const app = express();

const port = 5200;

app.get('/api', (req,res) => {
    res.status(200).json({
        mensaje: 'Bienvenido a la API'
    });
});

app.post('/api/posts', verifyToken, (req,res) => {
    jwt.verify(req.token, 'claveSecreta',  (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.status(200).json({
                mensaje: 'Post creado',
                authData
            });
        }
    })
})

app.post('/api/login', (req,res) => {
    // Mock User
    const user = {
        id:1,
        username: 'Fantastic',
        email: 'fantastic@mail.com'
    }
    jwt.sign({user}, 'claveSecreta', { expiresIn: "365d" }, (err, token) => {
        res.status(200).json({
            token: token
        });
    });
});

// Format of Token
// Authorization: Bearer access_token

// Verify Token
function verifyToken(req,res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if( typeof bearerHeader !=='undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        res.sendStatus(403);
    }
}

app.listen(port, () => console.log(`Servidor en ${port}`));