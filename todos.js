
module.exports = (app) => {


    const environment = process.env.NODE_ENV || 'development';
    const configuration = require('./knexfile')[environment];
    const database = require('knex')(configuration);

    const log = require('bunyan').createLogger({ name: 'express-crud-todos' });


    // note the async prefix, which means a promise
    app.get('/todos', async (req, res) => {
        try {

            let todoList = [];
            await database('todos').select()
                .then(rs => {
                    rs.forEach(r => {
                        todoList.push(r);
                    });
                });

            res.render('todos/list', {
                todoList: todoList
            });

        } catch (err) {
            //TODO: common error page rendering
        }

    });

    // this routing has to be put before '/:id' route
    app.get('/todos/new', (req, res) => {
        res.render('todos/new', {
            todo: {}
        });
    });

    app.get('/todos/:id', async (req, res) => {
        try {
            let td;
            await database('todos')
                .where({ id: req.params.id })
                .then(rs => { td = rs[0] });
            res.render('todos/show', { todo: td });
        } catch (err) {
            console.log(err);
        }
    });



    app.post('/todos', async (req, res) => {
        //validate request
        if (!req.body.title) {
            return res.status(400).send({ message: 'Todo title can not be empty' });
        }

        try {
            const todoId = await database('todos')
                .insert({
                    title: req.body.title,
                    completed: false
                }, 'id');
            log.info('todo created with id ' + todoId);
            res.redirect(`/todos/${todoId}`);
        } catch (err) {
            console.log(err);
        }
    });

    // app.put('/todos/:id', todosController.update);

    // app.patch('/todos/:id', todosController.patch);

    // app.delete('/todos/:id', todosController.delete);
};



