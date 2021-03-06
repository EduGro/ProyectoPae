const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
var bodyParser = require('body-parser');
const Database = require('./database');
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
const PORT = process.env.PORT || 3000;

require('dotenv').config({
    path: '.env'
});

// create application/json parser
var jsonParser = bodyParser.json();

const {
    connect
} = require('http2');

const app = express();
app.use(cors());

let db = new Database();

app.use(express.static(__dirname + '/public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

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

app.listen(PORT, () => {
    console.log('app is running in port 3000')
});

app.post('/imagenperfil', (req, res) => {
    console.log("imagen perfil")
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({
        storage: storage
    }).single(req.body.imgperfil);

    upload(req, res, function (err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        } else if (!req.file) {
            return res.send('Please select an image to upload');
        } else if (err instanceof multer.MulterError) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }
    });
});

app.get('/authgoogle', (req, res) => {
    console.log('Datos de google ID token recibidos', req.query['idToken']);
    googleClient.verifyIdToken({
        idToken: req.query['idToken'],
    }).then(response => {
        const data = response.getPayload();
        db.searchUsers(data.email).then((user) => {
            if (user.length == 1) {
                var usuario = {
                    "token": (Math.floor(Math.random() * 100) + 1) + data.name.substring(0, 3) + data.email.substring(0, 5),
                    "name": data.name,
                    "email": data.email
                };
                console.log(usuario);
                res.status(200).send(usuario);
            } else {
                res.status(403).send('No se ha registrado');
            }
        });
    }).catch(e => {
        console.log(e);
        res.status(400).send('bad credentials');
    })

});

app.get('/', (req, res) => {
    res.status(200).send("Hello World");
});

app.post('/registrogoogle', (req, res) => {
    console.log('Datos de google ID token recibidos', req.body.idToken);
    googleClient.verifyIdToken({
        idToken: req.body.idToken,
    }).then(response => {
        const data = response.getPayload();
        db.searchUsers(data.email).then((user) => {
            if (user.length == 0) {
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

                db.insertUserGoogle(user);
                res.status(200).send(sending);
            } else {
                res.status(403).send('Ya est?? registrado');
            }
        });
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
            if (result == null || result == "")
                res.status(500).send("Server Failure")
            var recipes = result["recipes"];
            var recipe = [];
            var i;
            for (i = 0; i < recipes.length; i++) {
                var iRecipe = {
                    name: recipes[i]["title"],
                    id: recipes[i]["id"],
                    image: recipes[i]["image"]
                };
                recipe.push(iRecipe);
            }
            res.status(200).send(recipe);

        }).catch(e => {
            console.log(e);
            res.status(500).send("Server error");
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
app.post('/recipesInfo', async function (req, res) {
    var id = req.body.id;
    var url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.SPOON_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(result => {
            if (result == "" || result == null)
                res.status(404).send("Recipe id not found");
            var ingredient = [];
            var ingredients = result["extendedIngredients"];
            var i;
            for (i = 0; i < ingredients.length; i++) {
                ingredient.push(ingredients[i]["original"]);
            }
            var step = [];
            var steps = result["analyzedInstructions"];
            if (steps != "" && steps != null) {
                steps = steps[0]["steps"];
                for (i = 0; i < steps.length; i++)
                    step.push(steps[i]["step"]);
            } else
                step.push("Steps not found");
            var cuicine = "";
            if (result["cuisines"] == null || result["cuisines"] == "")
                cuicine = "Cuicine not found";
            else
                for (i = 0; i < result["cuisines"].length; i++)
                    cuicine += (result["cuisines"][i] + ",")
            var toSend = {
                name: result["title"],
                prep_time: `${result["readyInMinutes"]} min`,
                cost: `$${result["pricePerServing"]}`,
                servings: `${result["servings"]}`,
                cuicine: cuicine,
                ingredients: ingredient,
                steps: step,
                image: result["image"]
            }
            res.status(200).send(toSend)
        }).catch(e => {
            console.log(e);
            res.status(500).send("Server error");
        });
});

app.post('/recipesSearch', async function (req, res) {
    var query = req.body.query;
    var cuisine = req.body.cuisine;
    var intolerances = req.body.intolerances;
    var url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${process.env.SPOON_KEY}&number=5`;
    if (cuisine != null) {
        url += `&cuisine=${cuisine}`;
    }
    if (intolerances != null) {
        url += `&intolerances=${intolerances}`;
    }
    fetch(url)
        .then(response => response.json())
        .then(result => {
            if (result["totalResults"] > 0)
                res.status(200).send(result["results"])
            else
                res.status(404).send("No results");

        }).catch(e => {
            console.log(e);
            res.status(500).send("Server error");
        });
});

app.get('/getlists', (req, res) => {
    var email = req.query['email'];
    db.searchUsersListas(email).then((listas) => {
        var lists = new Array();
        for (let i in listas) {
            let lista = {
                "nombre": listas[i].nombre,
                "descripcion": listas[i].descripcion,
                "id": listas[i]._id
            }
            lists.push(lista);
        }
        res.status(200).send(lists);
    }).catch(e => {
        console.log(e);
        res.status(404).send('Not Found');
    });
});

app.post('/addlist', (req, res) => {
    var email = req.query['email'];
    var nombre = req.body.nombre;
    var desc = req.body.desc;
    db.insertToLists(nombre, desc).then((lista) => {
        db.searchUsers(email).then((r) => {
            db.insertToUsuariosListas(lista, r[0]._id);
            res.status(201).send();
        }).catch(e => {
            console.log(e);
            res.status(400).send('Bad Request');
        });
    }).catch(e => {
        console.log(e);
        res.status(404).send('Not Found');
    });
});

app.get('/getuser', (req, res) => {
    var email = req.query['email'];
    db.searchUsers(email).then((u) => {
        var user = {
            "name": u[0].nombre,
            "image": u[0].imagen,
            "email": u[0].correo
        }
        res.status(200).send(user);
    }).catch(e => {
        console.log(e);
        res.status(404).send('Not Found');
    });
});

app.get('/auth', (req, res) => {
    var email = req.query['correo'];
    db.searchUsers(email).then((u) => {
        if (u.length != 0) {
            let pass;
            if (!u[0].password) {
                pass = null;
            } else {
                if (u[0].password == req.query['pass']) {
                    pass = true;
                } else {
                    pass = false;
                }
            }
            res.status(200).send(pass);
        } else {
            res.status(403).send('No se ha registrado');
        }
    }).catch(e => {
        console.log(e);
        res.status(403).send('Not Found');
    });
});

app.delete('/deletelist', (req, res) => {
    var email = req.query['email'];
    db.searchUsers(email).then((user) => {
        db.deleteList(user[0]._id, req.query['idList']);
        res.status(200).send('ok');
    }).catch(e => {
        console.log(e);
        res.status(404).send('Not Found');
    });
});

app.post('/addtolist', (req, res) => {
    var idlist = req.body.idList;
    var idrecipe = req.body.idRecipe;
    db.insertRecipeToList(idlist, idrecipe, req.body.image, req.body.name);
    res.status(200).send('ok');
});

app.get('/getrecipes', (req, res) => {
    var idList = req.query['idList'];
    db.searchListasRecetas(idList).then((recetas) => {
        var recipes = new Array();
        for (let i in recetas) {
            let receta = {
                "nombre": recetas[i].name,
                "imagen": recetas[i].image,
                "id": recetas[i].idReceta
            }
            recipes.push(receta);
        }
        res.status(200).send(recipes);
    }).catch(e => {
        console.log(e);
        res.status(404).send('Not Found');
    });
});

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'images'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const flag = file.mimetype.startsWith('image');
    cb(null, flag);
};

const uploadFile = multer({
    storage: multerStorage,
    fileFilter: fileFilter
});

app.post('/usermongo', (req, res) => {
    let user = {
        "name": req.body['nombre'],
        "email": req.body['correo'],
        "password": req.body['password'],
        "token": (Math.floor(Math.random() * 100) + 1) + req.body['nombre'].substring(0, 3) + req.body['correo'].substring(0, 5),
    }
    db.insertUser(user, 'https://pbs.twimg.com/profile_images/1056643396507459585/-jhnJW4v.jpg');

    res.status(200).send(user);
});