const {MongoClient, ObjectId} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to Mongodb server', err);
    }
    console.log('Connected to mongodb server');
    const db = client.db('TodoApp');
    //delete many
    db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) =>

        console.log(result);
    });
    db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
        console.log(result);
    });
    //findOneAndDelete
    db.collection('Todos').findOneAndDelete({_id: new ObjectId('"5b26c02edaa8c05025839be5')}).then((result) => {
        console.log(result);
    })
    //delete one

    //client.close();
});