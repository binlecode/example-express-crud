const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: 'express-crud' });

// const dbConfig = require('./config/database.config.js');

const app = express();
// enable cors for SPA app to call
app.use(cors());
// use morgan to log http traffic
app.use(morgan('combined'))
// app.use(morgan('dev'))

// set the view engine to ejs
app.set('view engine', 'ejs');

// parse requests of content-type - application/x-www-form-urlencoded
// The urlencoded middleware is to extract data from the <form> element 
// and add them to the body property in the request object.
// The json middleware parses requests with content-type as application/json

// for express v4.16.0 or higher, bodyParser.urlencoded and json() are 
// part of express

app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log('Request Headers:')
    for (const key in req.headers) {
        console.log(
            `   ${key}: ${req[key]}`
        );
    }
    // throw new Error('Intentionally thrown error');
    next();
});

// global error handler
app.use((err, req, res, next) => {
    // console.error(err.stack);
    log.error(err.stack);
    // TODO: in dev env, include error stack info in response 
    res.status(500).send('Something broke!')
});

// app.use('/health', require('./healthcheck')());
// provide custom healthcheck response body
// app.use('/health', require('./healthcheck')({
app.use('/health', require('./healthcheck-basic')({
    healthy: () => {
        return {
            pid: process.pid,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpuUsage: process.cpuUsage()
        };
    },
    indicators: {
        device1: () => {
            return {
                status: 'UP'
            };
        },
        network1: () => {
            return {
                status: 'DOWN',
                message: 'TTL longer than expected.'
            };
        }
    }
}));


app.get('/', (req, res) => {

    let respBody = {
        message: 'welcome to express crud template app',
        requestDetails: {
            route: req.route,
            headers: req.headers
        }
    }
    res.json(respBody);

    // res.send('hello express!');
    // let cursor = db.collection('quotes').find()
    // .toArray((err, results) => {
    // console.log(results);
    // });
    // res.sendFile(__dirname + '/index.html');
});

app.get('/hello', (req, res) => {
    res.type('text/plain')  // set Content-Type
        .send('this is a string message of hello page');
});

app.get('/about', (req, res) => {
    res.json({
        env: app.get('env'),
        ip: req.ip,
        url: req.url,
        originalUrl: req.originalUrl,
        hostname: req.hostname,
        protocol: req.protocol,
        qeury: req.query,
        cookie: req.cookie || 'no cookie',
        session: req.session || 'no session',
        // xhr: request.xhr || false
    });
});

// load todos mvc
require('./todos.js')(app);

app.listen(3000, function () {
    // console.log('server is up and listening on 3000');
    log.info('server is up and listening on port 3000');
});