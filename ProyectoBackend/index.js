const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
var bodyParser = require('body-parser');
const Database = require('./database');

const { OAuth2Client } = require('google-auth-library');
const { Console } = require('console');
const app = express();
app.use(cors());

let db = new Database();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

if(process.env.NODE_ENV==='dev'){
    require('dotenv').config();
}

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

app.listen(3000, () => {
    console.log('app is running in port 3000')
});

app.post('/authgoogle', (req, res) => {
    console.log('Datos de google ID token recibidos', req.body.idToken);
    googleClient.verifyIdToken({
        idToken: req.body.idToken,
    }).then(response => {
        const data = response.getPayload();
        console.log(data);
        var sending = {
            "token": 123,
            "Name": data.name
        };
        res.send(sending);
    }). catch(e => {
        console.log(e);
        res.status(400).send('bad credentials');
    })
    
});

app.get('/authgoogle', (req, res) => {
    res.status(201).send('Ok');
});

app.get('/', (req, res) => {
    res.status(200).send();
});

app.post('/registrogoogle', (req, res) => {
    console.log('Datos de google ID token recibidos', req.body.idToken);
    googleClient.verifyIdToken({
        idToken: req.body.idToken,
    }).then(response => {
        const data = response.getPayload();
        console.log(data);
        var sending = {
            "token": (Math.floor(Math.random() * 100) + 1)+data.name.substring(0,3)+data.email.substring(0,5),
            "Name": data.name
        };

        var user = {
            "name": data.name,
            "email": data.email
        };
        
        db.useCollection('users');
        db.insertUserGoogle(user);

        res.send(sending);
    }). catch(e => {
        console.log(e);
        res.status(400).send('bad credentials');
    })
    
});

app.get('/registrogoogle', (req, res) => {
    res.status(201).send('Ok');
});