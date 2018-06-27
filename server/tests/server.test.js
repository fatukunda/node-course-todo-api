const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { ObjectID } = require('mongodb');

// Dummy data
const todos = [{
    _id: new ObjectID(),
    text: 'First todo'
},{
    _id: new ObjectID(),
    text: 'Second todo',
    completed: true,
    completedAt: 67653
}];
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done())
});
describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'take a nap';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(err => done(err));
            })
    });
    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(err => done(err));
            })
    })
    });
describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
});
describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        const id = todos[0]._id.toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });
    it('should return a 404 if todo not found', (done) => {
        const id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
    it('should return a 404 for non-object id', (done) => {
        const id = '12345';
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    })
});
describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        const id =todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id)
            })
            .end((err, res) => {
                if(err){
                    return done(err)
                }
                Todo.findById(id).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((err) => done(err));
            });
    });
    it('should return a 404 if todo is not found', (done) => {
        const id = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
    it('should return a 404 if objectid is invalid', (done) => {
        const id = '123abc';
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done)
    })

});
describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        const id =todos[0]._id.toHexString();
        const text = 'Visit Michael';
        request(app)
            .patch(`/todos/${id}`)
            .send({text, completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            }).end(done);
    });
    it('should clear completedAt when todo is not completed ', (done) => {
        const id =todos[1]._id.toHexString();
        const text = 'Take meds';
        request(app)
            .patch(`/todos/${id}`)
            .send({text, completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(null)
            }).end(done)
    });
});