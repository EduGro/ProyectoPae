const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
var ObjectId = require('mongodb').ObjectID;

let db;
let isConnecting;

dotenv.config();

const mongoURL = process.env.MONGO_URL;

class Database {
    collectionName;

    constructor() {
        if (isConnecting) return;

        isConnecting = true;

        MongoClient.connect(mongoURL, {
            useUnifiedTopology: true
        }, (err, client) => {
            if (err) {
                console.log('Failed to connect to MongoDB');
                return;
            }
            
            db = client.db();
            console.log('Successfully connected to MongoDB');
        });

        setTimeout(() => {
            //console.log('Database connection timeout', db);
        }, 2000);
    }

    useCollection(name) {
        this.collectionName = name;
    }

    insertUser(user){
        const collection = db.collection(this.collectionName);
        collection.insertOne({
            nombre: user.name,
            correo: user.email,
            pass: user.password
        }).then((r) => {
            console.log("Insertado");
        }).catch(err => {
            console.log("Falló al insertar", err);
        });
    }

    insertUserGoogle(user){
        const collection = db.collection(this.collectionName);
        collection.insertOne({
            nombre: user.name,
            correo: user.email,
            imagen: user.image
        }).then((r) => {
            console.log("Insertado");
        }).catch(err => {
            console.log("Falló al insertar", err);
        });
    }

    searchUsers(email) {        
        return db.collection('users').find({'correo': email}).toArray();
    }

    searchUsersListas(email) {
        return this.searchUsers(email).then((user) => {
            return db.collection('usuarios-lista').find({ 'idUsuario': (user[0]._id).toString() }).toArray();
        }).then(listas => {
            var nombres = new Array();
            for (let i in listas) {
                nombres.push((listas[i].idLista));
            }
            return db.collection('listas').find({ '_id': { '$in': nombres.map(function (id) {return ObjectId(id);}) } }).toArray();
        });
    }

}

module.exports = Database;