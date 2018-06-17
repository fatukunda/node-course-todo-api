const {MongoClient, ObjectId} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to Mongodb server', err);
    }
    console.log('Connected to mongodb server');
    const db = client.db('TodoApp');
    db.collection('users').find().count().then((count) => {
        console.log('Count: ', count);
    }, (err) => {
        console.log('Could not count', err);
    });

    db.collection('users').find({
        _id: new ObjectId('5b2694bedaa8c05025839389')
    }).toArray().then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch data', err);
    });
    client.close();
});