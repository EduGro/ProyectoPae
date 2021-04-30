const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
var bodyParser = require('body-parser');
var aws = require('aws-sdk'); // ^2.2.41
var multer = require('multer'); // "multer": "^1.1.0"
var multerS3 = require('multer-s3'); //"^1.4.1"


const {
    OAuth2Client
} = require('google-auth-library');
const {
    Console
} = require('console');
const app = express();
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

aws.config.update({
    secretAccessKey: process.env.AWSSecretKey,
    accessKeyId: process.env.AWSAccessKeyId,
    region: 'us-east-2'
});

var s3 = new aws.S3();

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'pae-proyecto',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});


if (process.env.NODE_ENV === 'dev') {
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
    }).catch(e => {
        console.log(e);
        res.status(400).send('bad credentials');
    })

});

app.get('/authgoogle', (req, res) => {
    res.status(201).send('Ok');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
//open in browser to see upload form
app.get('/create', function (req, res) {
    res.render("createUser");
});

//app.post('/signup', upload.array('upl',1), function (req, res, next) {
//    //TODO GUARDAR A MONGO
//    var sending = {
//        "token": 123,
//        "Name": res.name
//    };
//    res.send(sending);
//});

//used by upload form
app.post('/create', upload.array('upl', 1), function (req, res, next) {
    console.log(req.body);
    var sending = {
        "token": 123,
        "Name": req.body.name
    };
    res.send(sending);
});
