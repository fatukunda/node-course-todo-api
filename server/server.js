const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectId} = require('mongodb');

const app = express();
app.use(bodyParser.json());
// POST /todos
app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    })
});

//GET /todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send ({todos});
    }, (err) => {
        res.status(400).send(err);
    })
});
//GET /todos/:id
app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    if(!ObjectId.isValid(id)){
       return res.status(404).send();
    }
    Todo.findById(id).then((todo) => {
        if(!todo){
           return res.status(404).send();
        }
        res.send({ todo });
    }).catch((err) => {
        res.status(400).send();
    })
});
//DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    if(!ObjectId.isValid(id)){
        return res.status(404).send('Invalid Id');
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            return res.status(404).send('No such todo');
        }
        res.send({ todo })
    }).catch((err) => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Listening on port ${port} `);
});

module.exports = { app };