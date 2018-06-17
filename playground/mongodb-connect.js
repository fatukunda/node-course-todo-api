//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to Mongodb server')
    }
    console.log('Connected to Mongodb server');
    const db = client.db('TodoApp');
    // db.collection('Todos').insertOne({
    //     text: 'something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to insert item');
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //Collection users
    db.collection('users').insertOne({
        name: 'Jackie',
        age: 25,
        location: 'Brussels'
    }, (err, result) => {
        if(err){
            return console.log('Unable to insert data', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });
    client.close();
});