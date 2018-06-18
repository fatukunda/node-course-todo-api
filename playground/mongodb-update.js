const {MongoClient, ObjectId} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to Mongodb server', err);
    }
    console.log('Connected to mongodb server');
    const db = client.db('TodoApp');
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectId('5b2648425c2d9e313c961f7a')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    db.collection('users').findOneAndUpdate({
        _id: new ObjectId('5b264f58f7ac7a1998417fc1')
    }, {
        $set: {
            name: 'Paul'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })

    //client.close();
});