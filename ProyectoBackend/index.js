const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
var bodyParser = require('body-parser');
const Database = require('./database');
const socketIo = require('socket.io');
const fetch = require("node-fetch");

const {
    OAuth2Client
} = require('google-auth-library');
const {
    Console
} = require('console');
var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
const request = require('request');

require('dotenv').config({
    path: '.env'
});

const { connect } = require('http2');

const app = express();
app.use(cors());

let db = new Database();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'dev') {
    require('dotenv').config();
}

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

const server = app.listen(3000, () => {
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
            "name": data.name,
            "email": data.email
        };
        res.send(sending);
    }).catch(e => {
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
            "token": (Math.floor(Math.random() * 100) + 1) + data.name.substring(0, 3) + data.email.substring(0, 5),
            "name": data.name,
            "email": data.email
        };

        var user = {
            "name": data.name,
            "email": data.email
        };

        db.useCollection('users');
        db.insertUserGoogle(user);

        res.send(sending);
    }).catch(e => {
        console.log(e);
        res.status(400).send('bad credentials');
    })
});

app.get('/recipesRandom', async function (req, res) { 
    var url = `https://api.spoonacular.com/recipes/random?apiKey=${process.env.SPOON_KEY}&number=6`;
    fetch(url)
        .then(response => response.json())
        .then(result => {
            res.status(200).send(result)
    });
});

app.get('/recipesRandom', async function (req, res) { 
    var url = `https://api.spoonacular.com/recipes/random?apiKey=${process.env.SPOON_KEY}&number=6`;
    fetch(url)
        .then(response => response.json())
        .then(result => {
            res.status(200).send(result)
    });
});

//used by upload form
/*app.post('/create', upload.array('upl', 1), function (req, res, next) {
    console.log(req.body);
    var sending = {
        "token": 123,
        "Name": req.body.name
    };
    res.send(sending);
});*/
app.get('/recipesInfo', async function (req, res) { 
    var id = req.body.id;
    var url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.SPOON_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(result => {
            res.status(200).send(result)
    });
});

app.get('/registrogoogle', (req, res) => {
    res.status(201).send('Ok');
});

app.get('/getlists', (req, res) => {
    var email = req.query['email'];
    //db.useCollection('users');
    db.searchUsersListas(email).then((listas) => {
        var lists = new Array();
        for (let i in listas) {
            let lista = {
                "nombre": listas[i].nombre,
                "descripcion": listas[i].descripcion
            }
            lists.push(lista);
        }
        res.status(201).send(lists);
    }).catch(e => {
        console.log(e);
        res.status(404).send('Not Found');
    });
});

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    allowHeaders: ['Authorization'],
    credentials: true
  }
});

io.on('connection', socket => {

  const authToken = socket.handshake.headers['authorization'];

  console.log('Se ha conectado', authToken);

  socket.join('admins');

  socket.on('likedNews', data => {
    console.log('News liked: ', data);

    // io.to('admins').emit('userLikedNews', data);
    socket.broadcast.emit('userLikedNews', data);
  })
})
