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

// create application/json parser
var jsonParser = bodyParser.json();

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
        
        var sending = {
            "token": (Math.floor(Math.random() * 100) + 1) + data.name.substring(0, 3) + data.email.substring(0, 5),
            "name": data.name,
            "email": data.email
        };

        var user = {
            "name": data.name,
            "email": data.email,
            "image": data.picture
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

//https://spoonacular.com/food-api/docs

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

app.get('/recipesSearch' ,async function (req, res) { 
    var query = req.body.query;
    console.log(req.body);
    var cuisine = req.body.cuisine;
    var intolerances = req.body.intolerances;
    var url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${process.env.SPOON_KEY}&number=5`;
    console.log(cuisine);
    if(cuisine != null){
        url += `&cuisine=${cuisine}`;
    }
    if(intolerances != null){
        url += `&intolerances=${intolerances}`;
    }
    console.log(url);
    /*fetch(url)
        .then(response => response.json())
        .then(result => {
            res.status(200).send(result)
    });*/
    res.status(200).send("RESPUESTA!!!!");
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

app.post('/addlist', (req, res) => {
    var email = req.body.params['email'];
    var nombre = req.body.body['nombre'];
    var desc = req.body.body['desc'];
    db.insertToLists(nombre, desc).then((lista) => {
        db.searchUsers(email).then((r) => {
            db.insertToUsuariosListas(lista, r[0]._id);
            res.status(201);
        }).catch(e => {
            console.log(e);
            res.status(400).send('Bad Request');
        });
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
/*
app.post('/usermongo',(req,res)=>{
    console.log("ewe")
    var nombre = req.body['nombre'];
    var correo = req.body['correo'];
    var password = req.body['password'];
    db.insertUser(nombre, correo, password);
}).catch(e => {
    console.log(e);
    res.status(400).send('Bad Request');
});*/

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
